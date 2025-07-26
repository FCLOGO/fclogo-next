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