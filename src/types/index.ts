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