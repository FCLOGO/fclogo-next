import { MetadataRoute } from 'next'
import { client } from '@/lib/sanity.client';
import { siteConfig } from '@/config/site';

type LogoSitemapData = {
  slug: { current: string };
  _updatedAt: string;
  pngUrl: string; // 我们期望从 GROQ 得到一个字符串
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  
  // 1. 使用我们之前修正的、安全的 GROQ 查询
  const query = `*[_type == "logo"]{ 
    slug, 
    _updatedAt, 
    pngUrl,
  }`;
  
  const logos = await client.fetch<LogoSitemapData[]>(query);

  const logoUrls = logos
    // 2. 过滤掉任何没有有效 pngUrl 的徽标
    .filter(logo => logo.pngUrl && typeof logo.pngUrl === 'string')
    .map(logo => {
      const urlPath = logo.slug.current.startsWith('/') ? logo.slug.current : `/${logo.slug.current}`;

      return {
        url: `${siteConfig.baseUrl}${urlPath}`,
        lastModified: new Date(logo._updatedAt),
        images: [ `${siteConfig.assetsUrl}/${logo.pngUrl}` ],
      };
  });

  const packs = await client.fetch<Array<{ slug: { current: string }, _updatedAt: string }>>(`
    *[_type == "logoPack"]{ slug, _updatedAt }
  `);

  const packUrls = packs.map(pack => ({
    url: `${siteConfig.baseUrl}/pack/${pack.slug.current}`,
    lastModified: new Date(pack._updatedAt),
  }));

  const staticUrls = [
    { url: siteConfig.baseUrl, lastModified: new Date() },
    { url: `${siteConfig.baseUrl}/logos`, lastModified: new Date() },
    { url: `${siteConfig.baseUrl}/packs`, lastModified: new Date() },
    { url: `${siteConfig.baseUrl}/about`, lastModified: new Date() },
    { url: `${siteConfig.baseUrl}/links`, lastModified: new Date() },
    { url: `${siteConfig.baseUrl}/map`, lastModified: new Date() },
    { url: `${siteConfig.baseUrl}/contribution`, lastModified: new Date() },
  ];

  return [...staticUrls, ...packUrls, ...logoUrls];
}