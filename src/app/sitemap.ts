import { MetadataRoute } from 'next'
import { client } from '@/lib/sanity.client';
import { siteConfig } from '@/config/site';

type LogoSitemapData = {
  slug: { current: string };
  _updatedAt: string;
  pngUrl: string; // 我们期望从 GROQ 得到一个字符串
};

const LOCALES = ['en', 'zh-cn'];

function getUrl(path: string, locale: string): string {
  const prefix = locale === 'en' ? '' : `/${locale}`;
  // 确保 slug 前面只有一个 '/'
  const slug = path.startsWith('/') ? path.slice(1) : path;
  return `${siteConfig.baseUrl}${prefix}/${slug}`;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  
  const query = `*[_type == "logo"]{ 
    slug, 
    _updatedAt, 
    pngUrl,
  }`;
  
  const logos = await client.fetch<LogoSitemapData[]>(query);

  const logoUrls = logos
    .filter(logo => logo.pngUrl) // 过滤掉没有预览图的徽标
    .flatMap(logo => {
      // 为每个 locale 创建 URL 条目
      return LOCALES.map(locale => ({
        url: getUrl(logo.slug.current, locale),
        lastModified: new Date(logo._updatedAt),
        images: [ `${siteConfig.assetsUrl}/${logo.pngUrl}` ],
        alternates: {
          languages: {
            'en': getUrl(logo.slug.current, 'en'),
            'zh-CN': getUrl(logo.slug.current, 'zh-cn'),
            'x-default': getUrl(logo.slug.current, 'en'),
          },
        },
      }));
    });
  

  const packs = await client.fetch<Array<{ slug: { current: string }, _updatedAt: string }>>(`
    *[_type == "logoPack"]{ slug, _updatedAt }
  `);

  const packUrls = packs.flatMap(pack => {
    return LOCALES.map(locale => ({
      url: getUrl(`/pack/${pack.slug.current}`, locale),
      lastModified: new Date(pack._updatedAt),
      alternates: {
        languages: {
          'en': getUrl(`/pack/${pack.slug.current}`, 'en'),
          'zh-CN': getUrl(`/pack/${pack.slug.current}`, 'zh-cn'),
          'x-default': getUrl(`/pack/${pack.slug.current}`, 'en'),
        },
      },
    }));
  });

  const staticPaths = ['/', '/logos', '/packs', '/about', '/links', '/map', '/contribution'];
  const staticUrls = staticPaths.flatMap(path => {
    return LOCALES.map(locale => ({
      url: getUrl(path, locale),
      lastModified: new Date(),
      alternates: {
        languages: {
          'en': getUrl(path, 'en'),
          'zh-CN': getUrl(path, 'zh-cn'),
          'x-default': getUrl(path, 'en'),
        },
      },
    }));
  });

  return [...staticUrls, ...packUrls, ...logoUrls];
}