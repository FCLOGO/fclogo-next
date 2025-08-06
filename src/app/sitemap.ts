import { MetadataRoute } from 'next'
import { client } from '@/lib/sanity.client';
import { siteConfig } from '@/config/site';

const BASE_URL = siteConfig.baseUrl; // 替换成你的最终域名
const LOCALES = ['en', 'zh-cn']; // 与你的 i18n 配置保持一致

// 辅助函数，用于生成带 locale 前缀的 URL
// 它会遵循你 'as-needed' 的 localePrefix 规则
function getUrl(path: string, locale: string): string {
  // 假设 'en' 是你的默认语言，不带前缀
  const prefix = locale === 'en' ? '' : `/${locale}`;
  const slug = path.startsWith('/') ? path.slice(1) : path;
  return `${BASE_URL}${prefix}/${slug}`;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  
  // 获取所有徽标的 slug 和更新时间
  const logos = await client.fetch<Array<{ slug: { current: string }, _updatedAt: string }>>(`
    *[_type == "logo"]{ slug, _updatedAt }
  `);
  
  const logoUrls = logos.flatMap(logo => {
    // 为每个 locale 创建一个 URL 条目
    return LOCALES.map(locale => ({
      url: getUrl(logo.slug.current, locale),
      lastModified: new Date(logo._updatedAt),
      // ★★★ 核心部分：添加 alternates ★★★
      alternates: {
        languages: {
          en: getUrl(logo.slug.current, 'en'),
          'zh-CN': getUrl(logo.slug.current, 'zh-cn'), // 使用标准的语言-区域代码
          'x-default': getUrl(logo.slug.current, 'en'), // 指定一个默认的回退页面
        },
      },
    }));
  });

  // 获取所有徽标集的
  const packs = await client.fetch<Array<{ slug: { current: string }, _updatedAt: string }>>(`
    *[_type == "logoPack"]{ slug, _updatedAt }
  `);

  const packUrls = packs.flatMap(pack => {
    // 同样为每个 locale 创建 URL 条目
    return LOCALES.map(locale => ({
      url: getUrl(`pack/${pack.slug.current}`, locale),
      lastModified: new Date(pack._updatedAt),
      alternates: {
        languages: {
          en: getUrl(`pack/${pack.slug.current}`, 'en'),
          'zh-CN': getUrl(`pack/${pack.slug.current}`, 'zh-cn'),
          'x-default': getUrl(`pack/${pack.slug.current}`, 'en'),
        },
      },
    }));
  });

  // 处理静态页面
  const staticPaths = ['/', '/logos', '/packs', '/about', '/links', '/map', '/contribution']; // 定义你的静态路径
  const staticUrls = staticPaths.flatMap(path => {
    return LOCALES.map(locale => ({
      url: getUrl(path, locale),
      lastModified: new Date(),
      alternates: {
        languages: {
          en: getUrl(path, 'en'),
          'zh-CN': getUrl(path, 'zh-cn'),
          'x-default': getUrl(path, 'en'),
        },
      },
    }));
  });

  return [...staticUrls, ...logoUrls, ...packUrls];
}