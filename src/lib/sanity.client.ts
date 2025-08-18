import { createClient, type ClientConfig, type QueryParams } from "next-sanity";

const config: ClientConfig = {
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: new Date().toISOString().split('T')[0],
  useCdn: false, 
};

export const client = createClient(config);

export async function sanityFetch<QueryResponse>({
  query,
  params = {},
  revalidate = 2592000, // 默认缓存 30 天
  tags = [],
}: {
  query: string
  params?: QueryParams
  revalidate?: number | false
  tags?: string[]
}): Promise<QueryResponse> {
  return client.fetch<QueryResponse>(query, params, {
    // 在 Next.js 15 中，必须明确设置 cache 策略
    cache: 'force-cache',
    next: {
      // 如果有 tags，则依赖 tag-based revalidation
      // 如果没有，则使用 time-based revalidation
      revalidate: tags.length ? false : revalidate,
      tags, // 将 tags 传递给 Next.js 的 fetch
    },
  })
}