import type { Image as SanityImage } from '@sanity/types';

/**
 * 定义由 sanity-plugin-internationalized-array 生成的字符串数组类型
 */
export type InternationalizedString = Array<{
  _key: string;
  value: string;
}>;

/**
 * 从 @sanity/types 重新导出 Image 类型，可以在整个项目中统一使用
 */
export type Image = SanityImage;

export type LogoCardQueryResult = {
  _id: string;
  slug: { current: string };
  version: number;
  previewImage: Image;
  subject: {
    name: InternationalizedString;
    info: {
      shortName: InternationalizedString;
    };
    nation?: { // nation 是可选的
      flagSquare: Image;
    };
  };
  style: {
    title: InternationalizedString;
  };
};

export type LatestPackQueryResult = {
  title: InternationalizedString;
  season: string;
  slug: { current: string };
  sourceLogo: {
    previewImage: Image;
  };
  gridLogos: Array<{
    _id: string;
    previewImage: Image;
  }>;
};

/**
 * 徽标的详细信息和预览图像
 */

type LogoFragment = {
  _id: string;
  slug: { current: string };
  version: number;
  isOutdated?: boolean;
  isDoubtful?: boolean;
  isBgDark?: boolean;
  previewImage: Image;
  style: {
    title: InternationalizedString;
  };
  subject?: {
    timelineComplete?: boolean;
  }
};

export type FullLogoQueryResult = {
  _id: string;
  version: number;
  isOutdated?: boolean;
  isDoubtful?: boolean;
  isBgDark?: boolean;
  previewImage: Image;
  pngUrl: string;
  svgUrl: string;
  referenceInfo?: string;
  alternateNames?: string[];
  slug: { current: string };
  subject: {
    _type: 'club' | 'comp' | 'team' | 'assn' | 'conf';
    name: InternationalizedString;
    status: string;
    info: {
      shortName: InternationalizedString;
      localName?: string;
      founded?: number;
      city?: InternationalizedString;
      ground?: InternationalizedString;
      duration?: string;
      association?: string;
      confederation?: string;
      level?: InternationalizedString;
      promotion?: InternationalizedString;
      relegation?: InternationalizedString;
      teams?: number;
      affiliations?: string;
      headquarter?: InternationalizedString;
    };
    socialLinks: {
      twitterURL?: string;
      websiteURL?: string;
      weiboURL?: string;
      wikiURL?: string;
    };
    nation?: {
      name: InternationalizedString;
      flagRectangle: Image;
    };
  };
  style: {
    title: InternationalizedString;
  };
  contributor?: {
    name: string;
    profileUrl: string;
  };
  // 同版本的所有其他样式
  otherStyles: LogoFragment[];
  // 该主体的完整徽标历史
  logoHistory: LogoFragment[];
};

export type FullPackQueryResult = {
  _id: string;
  title: InternationalizedString;
  season: string;
  slug: { current: string };
  sourceLogo: {
    previewImage: Image;
  };
  sourceSubject: {
    _type: 'comp' | 'assn' | 'conf';
    name: InternationalizedString;
    info?: {
      shortName: InternationalizedString;
      localName?: string;
      founded?: number;
      city?: InternationalizedString;
      ground?: InternationalizedString;
      duration?: string;
      association?: string;
      confederation?: string;
      level?: InternationalizedString;
      promotion?: InternationalizedString;
      relegation?: InternationalizedString;
      teams?: number;
      affiliations?: string;
      headquarter?: InternationalizedString;
    };
    socialLinks: {
      twitterURL?: string;
      websiteURL?: string;
      weiboURL?: string;
      wikiURL?: string;
    };
  };
  items: LogoCardQueryResult[];
};

// 地图页面的 GROQ 查询结果类型
export type MapQueryResult = {
  _id: string;
  status: 'active' | 'inactive';
  name: InternationalizedString;
  location: {
    lng: number;
    lat: number;
  };
  logo?: { // logo 是可选的
    previewImage: Image;
  };
  nation?: { // nation 也是可选的
    name: InternationalizedString;
    code: string;
    center: {
      lng: number;
      lat: number;
    };
    zoom: number;
    flagRectangle: Image;
  };
};

// 传递给 MapContainer 的国家统计数据类型
export type CountryStat = {
  code: string;
  name: InternationalizedString;
  flag?: Image; // flag 是可选的
  center: [number, number];
  zoom: number;
  count: number;
};

// 为传递给 MapContainer 的俱乐部查找表类型
export type ClubDataMap = Record<string, {
  name: InternationalizedString;
  logoImage?: Image; // logoImage 是可选的
}>;

export type LinkQueryResult = {
  _id: string;
  name: string;
  url: string;
  description?: string;
  logo: Image;
}

export type contributorQueryResult = {
  _id: string;
  name: string;
  avatar?: Image;
  profileUrl?: string;
  contributionCount: number;
  recentContributions: Array<{
    _id: string;
    previewImage: Image;
    slug: {
      current: string;
    };
  }>;
}