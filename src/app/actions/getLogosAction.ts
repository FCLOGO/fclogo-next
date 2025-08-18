'use server'; 

import { sanityFetch } from '@/lib/sanity.client';
import type { LogoCardQueryResult } from '@/types';

const PAGE_SIZE = 20; // 每次加载的数量

export async function getLogosAction(page: number): Promise<LogoCardQueryResult[]> {
  const start = page * PAGE_SIZE;
  const end = start + PAGE_SIZE;

  const query = `*[_type == "logo"] | order(coalesce(dateOriginal, _createdAt) desc) [${start}...${end}] {
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
      revalidate: 604800, // 缓存 1 周
      tags: ['logos-list'], // 为所有列表页打上一个通用的标签
    });
    return logos;
  } catch (error) {
    console.error("Failed to fetch paginated logos:", error);
    return [];
  }
}