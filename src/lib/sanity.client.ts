import { createClient, type ClientConfig, type QueryParams } from "next-sanity";

const config: ClientConfig = {
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: new Date().toISOString().split('T')[0],
  useCdn: true, 
};

export const client = createClient(config);

export async function sanityFetch<QueryResponse>({
  query,
  params = {},
  tags = [],
}: {
  query: string
  params?: QueryParams
  tags?: string[]
}): Promise<QueryResponse> {
  return client.fetch<QueryResponse>(query, params, {
    // cache: 'force-cache',
    next: {
      tags, // 将 tags 传递给 Next.js 的 fetch
    },
  })
}