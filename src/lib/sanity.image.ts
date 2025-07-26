import imageUrlBuilder from '@sanity/image-url'
import type { Image } from '@sanity/types'
import { client } from './sanity.client'

const builder = imageUrlBuilder(client)

export function urlForImage(source: Image) {
  return builder.image(source)
}

export function getOptimizedImage(source: Image, width: number) {
  return builder
    .image(source)
    .width(width * 2) // 请求2倍图以适应高分屏 (Retina)
    .format('webp')   // 转换为现代的 WebP 格式
    .quality(80)      // 设置图片质量
    .url()            // 获取最终的 URL 字符串
}