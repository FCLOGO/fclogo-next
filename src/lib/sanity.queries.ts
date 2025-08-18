import { sanityFetch } from './sanity.client';
import type { FullLogoQueryResult, FullPackQueryResult, FullPageQueryResult } from '@/types';

export async function getLogoBySlug(slug: string): Promise<FullLogoQueryResult | null> {
  const query = `*[_type == "logo" && slug.current == $slug][0]{
    _id,
    version,
    isOutdated,
    isDoubtful,
    isBgDark,
    previewImage,
    pngUrl,
    svgUrl,
    referenceInfo,
    alternateNames,
    slug,
    subject->{
      _type,
      name,
      status,
      info {
        shortName,
        localName,
        founded,
        city,
        ground,
        duration,
        association,
        confederation,
        level,
        promotion,
        relegation,
        teams,
        affiliations,
        headquarter
      },
      socialLinks {
        twitterURL,
        websiteURL,
        weiboURL,
        wikiURL
      },
      nation->{
        name,
        flagRectangle
      }
    },
    style->{
      title
    },
    contributor->{
      name,
      profileUrl
    },
    // 获取同版本的所有其他样式
    "otherStyles": *[_type == "logo" && subject._ref == ^.subject._ref && version == ^.version] | order(style->title[0].value asc) {
      _id,
      slug,
      isBgDark,
      previewImage,
      style->{
        title
      }
    },
    // 获取该主体的徽标历史
    "logoHistory": *[_type == "logo" && subject._ref == ^.subject._ref && style->value.current in ["color", "comm", "minor"]] | order(version desc) {
       _id,
      slug,
      version,
      isDoubtful,
      previewImage,
      subject->{
        timelineComplete
      }
    }
  }`;
  
  try {
    const logo = await sanityFetch<FullLogoQueryResult>({
      query,
      params: { slug },
      tags: [`logo:${slug}`], // 为这个特定的 logo 添加一个缓存标签
    });
    return logo;
  } catch (error) {
    console.error("Failed to fetch logo by slug:", error);
    return null;
  }
}

export async function getPackBySlug(slug: string): Promise<FullPackQueryResult | null> {
  const query = `*[_type == "logoPack" && slug.current == $slug][0]{
    _id,
    title,
    season,
    slug,
    sourceSubject->{
      _type,
      name,
      status,
      info {
        shortName,
        localName,
        founded,
        city,
        ground,
        duration,
        association,
        confederation,
        level,
        promotion,
        relegation,
        teams,
        affiliations,
        headquarter
      },
      socialLinks {
        twitterURL,
        websiteURL,
        weiboURL,
        wikiURL
      }
    },
    sourceLogo->{
      previewImage,
      pngUrl
    },
    items[]->{
      _id,
      slug,
      previewImage,
      subject->{
        name,
      },
    }
  }`;
  
  try {
    // 我们也可以为 pack 添加标签
    const pack = await sanityFetch<FullPackQueryResult>({
      query,
      params: { slug },
      tags: [`pack:${slug}`],
    });
    return pack;
  } catch (error) {
    console.error("Failed to fetch pack by slug:", error);
    return null;
  }
}

export async function getPageBySlug(slug: string) {
  const query = `*[_type == "page" && slug.current == $slug][0]{
    _id,
    title,
    enContent,
    zhContent,
    timeline
  }`;
  try {
    // 我们也可以为 page 添加标签
    const page = await sanityFetch<FullPageQueryResult>({
      query,
      params: { slug },
      tags: [`page:${slug}`],
    });
    return page;
  } catch (error) {
    console.error("Failed to fetch page by slug:", error);
    return null;
  }
}

/**
 * 获取所有徽标的总数
 * @returns 徽标的总数
 */
export async function getTotalLogoCount(): Promise<number> {
  const query = `count(*[_type == "logo"])`;
  
  try {
    const count = await sanityFetch<number>({
      query,
      revalidate: 604800, // 缓存 1 周
      tags: ['logo-count'], 
    });
    return count;
  } catch (error) {
    console.error("Failed to fetch total logo count:", error);
    return 0; 
  }
}