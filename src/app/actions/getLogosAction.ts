'use server'; 

import { client } from '@/lib/sanity.client';
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
    const logos = await client.fetch(query);
    return logos;
  } catch (error) {
    console.error("Failed to fetch paginated logos:", error);
    return [];
  }
}