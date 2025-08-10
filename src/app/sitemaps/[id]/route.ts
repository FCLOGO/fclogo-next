import { client } from '@/lib/sanity.client';
import { siteConfig } from '@/config/site';
import type { MetadataRoute } from 'next';

const SITEMAP_BATCH_SIZE = 5000;
const LOCALES = ['en', 'zh-cn'];

function getUrl(path: string, locale: string): string {
  const prefix = locale === 'en' ? '' : `/${locale}`;
  // 确保 slug 前面只有一个 '/'
  const slug = path.startsWith('/') ? path.slice(1) : path;
  return `${siteConfig.baseUrl}${prefix}/${slug}`;
}


function generateSitemapXml(allUrls: MetadataRoute.Sitemap): string {
  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset 
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" 
  xmlns:image="http://www.google.com/schemas/sitemap-image/1.1" 
  xmlns:xhtml="http://www.w3.org/1999/xhtml"
>`;

  for (const item of allUrls) {
    xml += `
    <url>
      <loc>${item.url}</loc>
      ${item.lastModified ? `<lastmod>${new Date(item.lastModified).toISOString()}</lastmod>` : ''}
      ${item.alternates?.languages ? 
        Object.entries(item.alternates.languages).map(([lang, href]) => 
          `<xhtml:link rel="alternate" hreflang="${lang}" href="${href}" />`
        ).join('') 
        : ''
      }
      ${(item.images || []).map((image: string | { url: string }) => {
        const imageUrl = typeof image === 'string' ? image : image.url;
        return `
      <image:image>
        <image:loc>${siteConfig.assetsUrl}/${imageUrl}</image:loc>
      </image:image>`;
      }).join('')}
    </url>`;
  }

  xml += `\n</urlset>`;
  return xml;
}


export async function GET(
  request: Request,
  { params: paramsPromise }: { params: Promise<{ id: string }> }
) {
  const params = await paramsPromise;
  // 验证 id 是否为有效的数字
  const pageId = await parseInt(params.id, 10);
  if (isNaN(pageId) || pageId < 1) {
    return new Response('Invalid sitemap ID. Must be a number greater than 0.', { status: 400 });
  }

  // --- 1. 计算当前批次的起始和结束位置 ---
  const start = (pageId - 1) * SITEMAP_BATCH_SIZE;
  const end = start + SITEMAP_BATCH_SIZE;

  // --- 2. 分页查询 logos 和 packs ---
  const documents = await client.fetch<Array<{ _type: string, slug: { current: string }, _updatedAt: string, pngUrl?: string }>>(`
    *[_type in ["logo", "logoPack"]] | order(_createdAt asc) [${start}...${end}] {
      _type,
      slug,
      _updatedAt,
      ...select(_type == "logo" => { pngUrl })
    }
  `);

  // --- 3. 为当前批次的文档生成 URL ---
  const documentUrls = documents.flatMap(doc => {
    const path = doc._type === 'logoPack' ? `/pack/${doc.slug.current}` : doc.slug.current;
    
    return LOCALES.map(locale => ({
      url: getUrl(path, locale),
      lastModified: new Date(doc._updatedAt),
      // 只有 logo 才有 images
      ...(doc.pngUrl && { images: [doc.pngUrl] }),
      alternates: {
        languages: {
          'en': getUrl(path, 'en'),
          'zh-CN': getUrl(path, 'zh-cn'),
          'x-default': getUrl(path, 'en'),
        },
      },
    }));
  });

  // --- 4. 只有第一个 Sitemap (id === 1) 才包含静态页面 ---
  let staticUrls: MetadataRoute.Sitemap = [];
  if (pageId === 1) {
    const staticPaths = ['/', '/logos', '/packs', '/about', '/links', '/map', '/contribution'];
    staticUrls = staticPaths.flatMap(path => {
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
  }
  
  const allUrls = [...staticUrls, ...documentUrls];
  
  const sitemapContent = generateSitemapXml(allUrls);

  return new Response(sitemapContent, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
}