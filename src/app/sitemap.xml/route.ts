import { client } from '@/lib/sanity.client';
import { siteConfig } from '@/config/site';

const SITEMAP_BATCH_SIZE = 5000; // 每个分页文件包含的 URL 数量

export async function GET() {
  const count = await client.fetch<number>(`count(*[_type in ["logo", "logoPack"]])`);
  const sitemapCount = Math.ceil(count / SITEMAP_BATCH_SIZE);

  const sitemaps = Array.from({ length: sitemapCount }, (_, i) => {
    // 我们将分页文件放在 /sitemaps/1.xml, /sitemaps/2.xml ...
    return `${siteConfig.baseUrl}/sitemaps/${i + 1}.xml`;
  });

  const sitemapIndex = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${sitemaps.map(url => `<sitemap><loc>${url}</loc></sitemap>`).join('')}
</sitemapindex>`;

  return new Response(sitemapIndex, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
}