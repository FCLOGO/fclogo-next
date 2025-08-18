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
  revalidate = 604800, // 缓存 1 周
  tags = [],
}: {
  query: string
  params?: QueryParams
  revalidate?: number | false
  tags?: string[]
}): Promise<QueryResponse> {
  return client.fetch<QueryResponse>(query, params, {
    // 在 Next.js 15 中，必须明确设置 cache 策略
    // cache: 'force-cache',
    next: {
      revalidate: tags.length ? false : revalidate,
      tags, // 将 tags 传递给 Next.js 的 fetch
    },
  })
}