import type { Image, InternationalizedString } from '@/types';
import { sanityFetch } from './sanity.client';
import type { PackListFilter } from '@/app/actions/getPacksAction.constants';

export type PackNationCategory = {
  code: string;
  name: InternationalizedString;
  flagRectangle?: Image;
  count: number;
};

export type PackSeasonCategory = {
  key: string;
  count: number;
};

export type PackSidebarData = {
  nations: PackNationCategory[];
  seasons: PackSeasonCategory[];
};

type SidebarFilter = PackListFilter;

export function normalizePackSeasonKey(value?: string | null): string | undefined {
  const raw = value?.trim();
  if (!raw) return undefined;

  const fourDigitMatch = raw.match(/^(\d{4})/);
  if (fourDigitMatch) {
    return fourDigitMatch[1];
  }

  const twoDigitMatch = raw.match(/^(\d{2})/);
  if (twoDigitMatch) {
    return `20${twoDigitMatch[1]}`;
  }

  return undefined;
}

export function buildPackSeasonMatchPatterns(season?: string) {
  const normalized = normalizePackSeasonKey(season);
  if (!normalized) {
    return null;
  }

  return {
    longPattern: `${normalized}*`,
    shortPattern: `${normalized.slice(2)}*`,
  };
}

function groupByNormalizedSeasonCount<T extends { key?: string | null }>(items: T[]): PackSeasonCategory[] {
  const map = new Map<string, number>();

  for (const item of items) {
    const normalizedKey = normalizePackSeasonKey(item.key);

    if (!normalizedKey) {
      continue;
    }

    map.set(normalizedKey, (map.get(normalizedKey) ?? 0) + 1);
  }

  return Array.from(map.entries())
    .map(([key, count]) => ({ key, count }))
    .sort((a, b) => {
      const yearDiff = Number(b.key) - Number(a.key);
      if (Number.isFinite(yearDiff) && yearDiff !== 0) {
        return yearDiff;
      }

      if (b.count !== a.count) return b.count - a.count;
      return b.key.localeCompare(a.key);
    });
}

export async function getPackNationCategories(filter: SidebarFilter = {}): Promise<PackNationCategory[]> {
  const conditions = ['_type == "logoPack"', 'defined(sourceSubject->nation->code)'];
  const params: Record<string, string> = {};
  const seasonPatterns = buildPackSeasonMatchPatterns(filter.season);

  if (seasonPatterns) {
    conditions.push('(season match $seasonLongPattern || season match $seasonShortPattern)');
    params.seasonLongPattern = seasonPatterns.longPattern;
    params.seasonShortPattern = seasonPatterns.shortPattern;
  }

  const query = `*[
    ${conditions.join(' && ')}
  ]{
    "key": sourceSubject->nation->code,
    "name": sourceSubject->nation->name,
    "flagRectangle": sourceSubject->nation->flagRectangle
  }`;

  try {
    const rows = await sanityFetch<Array<{ key: string; name: InternationalizedString; flagRectangle?: Image }>>({
      query,
      params,
      tags: ['packs-categories'],
    });

    const grouped = new Map<string, PackNationCategory>();

    for (const row of rows) {
      const existing = grouped.get(row.key);
      if (existing) {
        existing.count += 1;
      } else {
        grouped.set(row.key, {
          code: row.key,
          name: row.name,
          flagRectangle: row.flagRectangle,
          count: 1,
        });
      }
    }

    return Array.from(grouped.values()).sort((a, b) => {
      if (b.count !== a.count) return b.count - a.count;
      const aName = a.name?.[0]?.value ?? a.code;
      const bName = b.name?.[0]?.value ?? b.code;
      return aName.localeCompare(bName);
    });
  } catch (error) {
    console.error('Failed to fetch pack nation categories:', error);
    return [];
  }
}

export async function getPackSeasonCategories(filter: SidebarFilter = {}): Promise<PackSeasonCategory[]> {
  const conditions = ['_type == "logoPack"'];
  const params: Record<string, string> = {};
  const seasonPatterns = buildPackSeasonMatchPatterns(filter.season);

  if (filter.nationCode) {
    conditions.push('sourceSubject->nation->code == $nationCode');
    params.nationCode = filter.nationCode;
  }

  if (seasonPatterns) {
    conditions.push('(season match $seasonLongPattern || season match $seasonShortPattern)');
    params.seasonLongPattern = seasonPatterns.longPattern;
    params.seasonShortPattern = seasonPatterns.shortPattern;
  }

  const query = `*[
    ${conditions.join(' && ')}
  ]{
    "key": season
  }`;

  try {
    const rows = await sanityFetch<Array<{ key: string }>>({
      query,
      params,
      tags: ['packs-categories'],
    });

    return groupByNormalizedSeasonCount(rows);
  } catch (error) {
    console.error('Failed to fetch pack season categories:', error);
    return [];
  }
}

export async function getPackSidebarData(filter: SidebarFilter = {}): Promise<PackSidebarData> {
  const [nations, seasons] = await Promise.all([
    getPackNationCategories({ season: filter.season }),
    getPackSeasonCategories({ nationCode: filter.nationCode }),
  ]);

  return { nations, seasons };
}
