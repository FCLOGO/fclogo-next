import { createClient } from 'next-sanity'
import imageUrlBuilder from '@sanity/image-url'
import type { Image as SanityImageType } from '@sanity/types'

export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET!
const apiVersion = new Date().toISOString().split('T')[0]

// 创建一个只用于图片 URL 构建的客户端实例
const imageClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true, // 图片 URL 可以安全地使用 CDN
})

const builder = imageUrlBuilder(imageClient)

export function urlForImage(source: SanityImageType) {
  return builder.image(source)
}

/**
 * 为 Sanity 图片生成一个经过优化的 URL
 * @param source - Sanity 图片对象
 * @param width - 期望的图片宽度
 * @returns 一个优化后的图片 URL 字符串
 */
export function getOptimizedImage(source: SanityImageType, width: number) {
  return builder
    .image(source)
    .width(width * 2) // 请求2倍图以适应高分屏 (Retina)
    .format('webp')   // 转换为现代的 WebP 格式
    .quality(80)      // 设置图片质量
    .url()            // 获取最终的 URL 字符串
}