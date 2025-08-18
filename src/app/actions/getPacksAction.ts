'use server'; 

import { sanityFetch } from '@/lib/sanity.client';
import type { LatestPackQueryResult } from '@/types';

const PAGE_SIZE = 20; // 每次加载的数量

export async function getPacksAction(page: number): Promise<LatestPackQueryResult[]> {
  const start = page * PAGE_SIZE;
  const end = start + PAGE_SIZE;

  const query = `*[_type == "logoPack"] | order(coalesce(dateOriginal, _createdAt) desc) [${start}...${end}] {
    title,
    season,
    slug,
    sourceLogo->{
      previewImage
    },
    "gridLogos": items[0...9]->{
      _id,
      previewImage
    }
  }`;
  
  try {
    const packs = await sanityFetch<LatestPackQueryResult[]>({
      query,
      // revalidate: 604800, // 同样缓存 1 小时
      tags: ['packs-list'],
    });
    return packs; 
  } catch (error) {
    console.error("Failed to fetch paginated packs:", error); // 注意：错误信息应为 packs
    return [];
  }
}