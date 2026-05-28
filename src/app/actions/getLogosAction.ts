'use server'; 

import { sanityFetch } from '@/lib/sanity.client';
import type { LogoCardQueryResult } from '@/types';
import { LOGOS_PAGE_SIZE, type LogoListFilter } from './getLogosAction.constants';

export async function getLogosAction(page: number, filter: LogoListFilter = {}): Promise<LogoCardQueryResult[]> {
  const start = page * LOGOS_PAGE_SIZE;
  const end = start + LOGOS_PAGE_SIZE;

  const conditions = ['_type == "logo"'];
  const params: Record<string, string> = {};

  if (filter.nationCode) {
    conditions.push('subject->nation->code == $nationCode');
    params.nationCode = filter.nationCode;
  }

  if (filter.subjectType) {
    conditions.push('subject->_type == $subjectType');
    params.subjectType = filter.subjectType;
  }

  const query = `*[${conditions.join(' && ')}] | order(coalesce(dateOriginal, _createdAt) desc) [${start}...${end}] {
    slug,
    version,
    isBgDark,
    previewImage,
    subject->{
      name,
      nation->{
        flagSquare
      },
      info {
        shortName
      }
    },
    style->{
      title
    }
  }`;
  
  try {
    // 列表页内容变化较快，我们可以设置一个较短的缓存时间，比如 1 小时
    const logos = await sanityFetch<LogoCardQueryResult[]>({
      query,
      params,
      // revalidate: 604800, // 缓存 1 周
      tags: ['logos-list'], // 为所有列表页打上一个通用的标签
    });
    return logos;
  } catch (error) {
    console.error("Failed to fetch paginated logos:", error);
    return [];
  }
}
