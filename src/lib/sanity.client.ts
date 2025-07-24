import { createClient } from '@sanity/client'

export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET!
const apiVersion = new Date().toISOString().split('T')[0]

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false, // 在服务器端渲染时建议设为 false，以获取最新数据
  token: process.env.SANITY_API_TOKEN, // 使用 token 可以访问未发布的草稿数据
})