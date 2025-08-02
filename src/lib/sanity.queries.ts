import { client } from './sanity.client';
import type { FullLogoQueryResult, FullPackQueryResult } from '@/types';

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
    const logo = await client.fetch(query, { slug });
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
      previewImage
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
    const pack = await client.fetch(query, { slug });
    return pack;
  } catch (error) {
    console.error("Failed to fetch pack by slug:", error);
    return null;
  }
}