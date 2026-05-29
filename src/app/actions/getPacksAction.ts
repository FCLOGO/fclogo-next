'use server'; 

import { sanityFetch } from '@/lib/sanity.client';
import type { LatestPackQueryResult } from '@/types';
import { PACKS_PAGE_SIZE, type PackListFilter } from './getPacksAction.constants';
import { buildPackSeasonMatchPatterns } from '@/lib/packCategory.queries';

export async function getPacksAction(page: number, filter: PackListFilter = {}): Promise<LatestPackQueryResult[]> {
  const start = page * PACKS_PAGE_SIZE;
  const end = start + PACKS_PAGE_SIZE;
  const conditions = ['_type == "logoPack"'];
  const params: Record<string, string> = {};

  if (filter.nationCode) {
    conditions.push('sourceSubject->nation->code == $nationCode');
    params.nationCode = filter.nationCode;
  }

  if (filter.season) {
    const seasonPatterns = buildPackSeasonMatchPatterns(filter.season);

    if (seasonPatterns) {
      conditions.push('(season match $seasonLongPattern || season match $seasonShortPattern)');
      params.seasonLongPattern = seasonPatterns.longPattern;
      params.seasonShortPattern = seasonPatterns.shortPattern;
    }
  }

  const query = `*[${conditions.join(' && ')}] | order(coalesce(dateOriginal, _createdAt) desc) [${start}...${end}] {
    title,
    season,
    slug,
    sourceLogo->{
      previewImage
    },
    sourceSubject->{
      nation->{
        code,
        name,
        flagRectangle
      }
    },
    "gridLogos": items[0...9]->{
      _id,
      previewImage
    }
  }`;
  
  try {
    const packs = await sanityFetch<LatestPackQueryResult[]>({
      query,
      params,
      tags: ['packs-list'],
    });
    return packs; 
  } catch (error) {
    console.error("Failed to fetch paginated packs:", error);
    return [];
  }
}
