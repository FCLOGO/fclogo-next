'use server'; 

import { client } from '@/lib/sanity.client';
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
    const logos = await client.fetch(query);
    return logos;
  } catch (error) {
    console.error("Failed to fetch paginated logos:", error);
    return [];
  }
}