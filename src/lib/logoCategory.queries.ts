import type { Image, InternationalizedString } from '@/types';
import { sanityFetch } from './sanity.client';
import type { SubjectTypeKey } from '@/config/logoCategories';
import type { LogoListFilter } from '@/app/actions/getLogosAction.constants';

export type NationCategory = {
  _id: string;
  code: string;
  name: InternationalizedString;
  flagRectangle?: Image;
  count: number;
};

export type SubjectTypeCategory = {
  key: SubjectTypeKey;
  count: number;
};

type SidebarFilter = Pick<LogoListFilter, 'nationCode' | 'subjectType'>;

export async function getNationCategories(limit?: number, filter: SidebarFilter = {}): Promise<NationCategory[]> {
  const limitClause = typeof limit === 'number' ? `[0...${limit}]` : '';
  const conditions = ['_type == "logo"', 'subject->nation._ref == ^._id'];
  const params: Record<string, string> = {};

  if (filter.subjectType) {
    conditions.push('subject->_type == $subjectType');
    params.subjectType = filter.subjectType;
  }

  const query = `*[_type == "nation"]{
    _id,
    code,
    name,
    flagRectangle,
    "count": count(*[${conditions.join(' && ')}])
  } | order(count desc, code asc)${limitClause}`;

  try {
    return await sanityFetch<NationCategory[]>({
      query,
      params,
      tags: ['logo-categories'],
    });
  } catch (error) {
    console.error('Failed to fetch nation categories:', error);
    return [];
  }
}

export async function getSubjectTypeCategories(filter: SidebarFilter = {}): Promise<SubjectTypeCategory[]> {
  const conditions = ['_type == "logo"'];
  const params: Record<string, string> = {};

  if (filter.nationCode) {
    conditions.push('subject->nation->code == $nationCode');
    params.nationCode = filter.nationCode;
  }

  const query = `{
    "club": count(*[${conditions.join(' && ')} && subject->_type == "club"]),
    "comp": count(*[${conditions.join(' && ')} && subject->_type == "comp"]),
    "team": count(*[${conditions.join(' && ')} && subject->_type == "team"]),
    "assn": count(*[${conditions.join(' && ')} && subject->_type == "assn"]),
    "conf": count(*[${conditions.join(' && ')} && subject->_type == "conf"])
  }`;

  try {
    const counts = await sanityFetch<Record<SubjectTypeKey, number>>({
      query,
      params,
      tags: ['logo-categories'],
    });

    return (['club', 'comp', 'team', 'assn', 'conf'] as SubjectTypeKey[]).map((key) => ({
      key,
      count: counts[key] ?? 0,
    }));
  } catch (error) {
    console.error('Failed to fetch subject type categories:', error);
    return [];
  }
}

export async function getLogoCategorySidebarData(filter: SidebarFilter = {}) {
  const [nations, allNations, subjectTypes] = await Promise.all([
    getNationCategories(20, { subjectType: filter.subjectType }),
    getNationCategories(undefined, { subjectType: filter.subjectType }),
    getSubjectTypeCategories({ nationCode: filter.nationCode }),
  ]);

  return { nations, allNations, subjectTypes };
}
