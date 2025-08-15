import { client } from '@/lib/sanity.client';
// import MapContainer from '@/components/MapContainer';
import type { MapQueryResult, CountryStat, ClubDataMap } from '@/types';
import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { siteConfig } from '@/config/site'; 

export const revalidate = 604800; // 页面每周重新生成一次

async function getMapData(): Promise<MapQueryResult[]> {
  const query = `*[_type == "club" && defined(location)]{
    _id,
    status,
    name,
    location,
    "logo": *[_type == "logo" && 
              subject._ref == ^._id && 
              isOutdated == false && 
              style->value.current == "color"][0]{
      previewImage
    },
    nation->{
      name,
      code,
      center,
      zoom,
      flagRectangle
    }
  }`;
  try {
    const clubs = await client.fetch(query);
    return clubs;
  } catch (error) {
    console.error("Failed to fetch map data:", error);
    return [];
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations();

  return {
    title: `${t('MapPage.pageTitle')} | ${t('HomePage.pageTitle')}`,
    description: t('MapPage.pageDescription'),
    openGraph: {
      title: `${t('MapPage.pageTitle')} | ${t('HomePage.pageTitle')}`,
      description: t('MapPage.pageDescription'),
      images: [
        {
          url: `${siteConfig.baseUrl}/logo-share.png`,
          width: 1200, // 推荐的 OG 图片宽度
          height: 630, // 推荐的 OG 图片高度
          alt: 'FCLOGO Website Share Image',
        },
      ],
    },
    alternates: {
      canonical: `${siteConfig.baseUrl}/map}`,
      languages: {
        'en-US': `${siteConfig.baseUrl}/map/`,
        'zh-CN': `${siteConfig.baseUrl}/zh-cn/map/`,
        'x-default': `${siteConfig.baseUrl}/map/`
      },
    },
  };
}

export default async function LogoMapPage() {
  const clubs = await getMapData();

  // 在服务器端处理数据聚合
  const geojsonData = {
    type: 'FeatureCollection',
    features: clubs.map((club: MapQueryResult) => ({
      type: 'Feature',
      properties: {
        id: club._id,
        status: club.status
      },
      geometry: {
        type: 'Point',
        coordinates: [club.location.lng, club.location.lat],
      },
    })),
  };

  const clubDataMap = clubs.reduce<ClubDataMap>((map, club) => {
    map[club._id] = {
      name: club.name, // 保留完整的 i18n 数组
      logoImage: club.logo?.previewImage,
    };
    return map;
  }, {});

  const nationCount = clubs.reduce<Record<string, CountryStat>>((acc, club) => {
    if (club.nation) {
      const code = club.nation.code;
      if (!acc[code]) {
        acc[code] = {
          code: code,
          name: club.nation.name,
          flag: club.nation.flagRectangle,
          center: [club.nation.center.lng, club.nation.center.lat],
          zoom: club.nation.zoom,
          count: 0,
        };
      }
      acc[code].count += 1;
    }
    return acc;
  }, {});
  
  const countryStats = Object.values(nationCount).sort((a: CountryStat, b: CountryStat) => b.count - a.count);

  return (
    <main className="w-full m-auto p-6 flex flex-grow flex-col flex-nowrap items-start h-[calc(100vh - 4rem)] min-h-150">
      {/* <MapComponent 
        geojsonData={geojsonData} 
        countryStats={countryStats} 
        clubDataMap={clubDataMap} 
      /> */}
      <h1>MAP PAGE</h1>
    </main>
  );
}