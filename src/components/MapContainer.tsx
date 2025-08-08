'use client';

import { useState, useRef, useCallback } from 'react';
import Map, { Source, Layer, Popup, FullscreenControl, NavigationControl, MapRef } from 'react-map-gl/mapbox';
import MapboxLanguage from '@mapbox/mapbox-gl-language';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useLocale, useTranslations } from 'next-intl';
import { localize } from '@/lib/utils';
import type { CountryStat, ClubDataMap, Image as SanityImageType, InternationalizedString } from '@/types';
import Image from 'next/image'; 
import SuspenseImage from './SuspenseImage';
import { getOptimizedImage } from '@/lib/sanity.image';
import { Eye, EyeClosed } from 'lucide-react';
import ClubIcon from './_icons/Club';

// 定义从 page.tsx 传来的 props 类型
type Props = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  geojsonData: any; 
  countryStats: CountryStat[]; // 国家统计数据
  clubDataMap: ClubDataMap;
};

type HoveredClub = {
  name: InternationalizedString; 
  logoImage?: SanityImageType;
  longitude: number;
  latitude: number;
}

const languageMap: Record<string, string> = {
  'en': 'en',
  'zh-cn': 'zh-Hans',
};

  const REMOVE_LAYER_LIST: string[] = [
    'road-label-simple',
    'waterway-label',
    'natural-line-label',
    'natural-point-label',
    'water-line-label',
    'water-point-label',
    'poi-label',
    'airport-label',
    'settlement-subdivision-label' //街道社区标签
  ]

  const CONTROL_LAYER_LIST: string[] = [
    'settlement-minor-label', // 县级标签
    'settlement-major-label', //市级标签
    'state-label', //省级标签
    'country-label', //国家标签
    'continent-label' //洲标签
  ]

export default function MapContainer({ geojsonData, countryStats, clubDataMap }: Props) {
  const t = useTranslations('MapPage');
  const locale = useLocale();
  const mapRef = useRef<MapRef | null>(null);
  
  // 默认的经度、纬度和缩放级别
  const defaultViewState = {
    longitude: 0,
    latitude: 10,
    zoom: 2.2
  }
  const [viewState, setViewState] = useState(defaultViewState)

  const [layersVisible, setLayersVisible] = useState(true)
  const [hoveredClub, setHoveredClub] = useState<HoveredClub | null>(null);

  const mapRefCallback = useCallback(
    (ref: MapRef | null) => {
      if (ref) {
        mapRef.current = ref
        const map = ref.getMap()
        // 获取页面的语言，并找到对应的 Mapbox 语言代码
        const language = languageMap[locale] || 'en' // 默认使用英语
        map.addControl(new MapboxLanguage({ defaultLanguage: language }))

        map.on('load', () => {
          REMOVE_LAYER_LIST.forEach(layerId => {
            map.removeLayer(layerId)
          })
          if (layersVisible) {
            CONTROL_LAYER_LIST.forEach(layerId => {
              map.setLayoutProperty(layerId, 'visibility', 'visible')
            })
          }
        })
      }
    },
    [locale, layersVisible]
  )

  // 悬浮事件
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onHover = useCallback((event: any) => {
    const { features } = event;
    const feature = features && features[0];

    if (feature) {
      if (!mapRef.current) return;

      mapRef.current.getCanvas().style.cursor = 'pointer';
      
      const clubId = feature.properties.id;
      // 使用 clubId 从我们的查找表中获取完整的、丰富的数据
      const richClubData = clubDataMap[clubId];

      if (richClubData) {
        setHoveredClub({
          ...richClubData,
          longitude: event.lngLat.lng,
          latitude: event.lngLat.lat,
        });
      }
    }
  }, [clubDataMap]); 

  const onLeave = useCallback(() => {
    if (!mapRef.current) return;
    mapRef.current.getCanvas().style.cursor = '';
    setHoveredClub(null);
  }, []);

  // 点击国家
  const handleCountryClick = (center: [number, number], zoom: number) => {
    mapRef.current?.flyTo({ center, zoom, duration: 1200 });
  };
  
  // 定义标记样式
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const circleLayerStyle: any = {
    id: 'club-points',
    type: 'circle',
    paint: {
      'circle-color': [
        'case',
        ['==', ['get', 'status'], 'active'], '#4264fb',
        ['==', ['get', 'status'], 'inactive'], '#7f8c8d',
        '#4264fb',
      ],
      'circle-radius': 6,
      'circle-stroke-width': 2,
      'circle-stroke-color': '#ffffff',
    },
  };

  // 显示/隐藏位置标签
  const toggleLayersVisibility = () => {
    if (!mapRef.current) return;
    const map = mapRef.current.getMap()
    const newVisibility = layersVisible ? 'none' : 'visible'
    CONTROL_LAYER_LIST.forEach(layerId => {
      if (map.getLayer(layerId)) {
        map.setLayoutProperty(layerId, 'visibility', newVisibility)
      }
    })
    setLayersVisible(!layersVisible)
  }
  return (
    <section className="w-full m-auto flex flex-col overflow-visible h-full">
      <div className="rounded-lg overflow-hidden h-full">
        <Map
          {...viewState}
          onMove={evt => setViewState(evt.viewState)}
          style={{ width: '100%', height: '100%' }}
          mapStyle="mapbox://styles/mapbox/dark-v11"
          projection={'mercator'} //设置地图投影
          mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
          ref={mapRefCallback}
          interactiveLayerIds={['club-points']}
          onMouseEnter={onHover}
          onMouseLeave={onLeave}
        >
          <FullscreenControl position="top-right" />
          <NavigationControl position="bottom-right" showCompass={false} />

          <div className="absolute w-[29px] h-[29px] right-2.5 top-12 bg-white z-50 rounded">
            <button onClick={toggleLayersVisibility} className='w-full h-full flex items-center justify-center p-1 cursor-pointer'>
              {layersVisible ? <EyeClosed /> : <Eye /> }
            </button>
          </div>
          
          <Source type="geojson" data={geojsonData}>
            <Layer {...circleLayerStyle} />
          </Source>

          <div className="text-neutral-content absolute bg-black/85 h-full w-64 hidden p-4 pb-10 map:flex flex-col justify-between">
            <header className="border-b border-b-base-100/35">
              <ClubIcon className="w-12 h-12 stroke-neutral-content stroke-24 mb-4" />
              <h3 className="uppercase font-semibold text-lg tracking-wider mb-4">
                {t('clubStatistics')}
              </h3>
            </header>
            <div className="overflow-y-auto flex-grow">
              <ul>
                {countryStats.map(country => (
                  <li key={country.code} onClick={() => handleCountryClick(country.center, country.zoom)} className="cursor-pointer py-3 border-b border-dashed border-white/20">
                    <span className="font-mono text-4xl">{country.count}</span>
                    <div className="flex flex-row items-center mt-2">
                      {country.flag && (
                        <Image
                          src={getOptimizedImage(country.flag, 20)}
                          alt={localize(country.name, locale)}
                          width={20}
                          height={20}
                          className="object-contain mr-2"
                        />
                      )}
                      <p className="text-sm">{localize(country.name, locale)}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div
              onClick={() => mapRef.current?.flyTo(defaultViewState)}
              className="cursor-pointer w-full flex flex-col pt-4 border-t border-t-base-100/35"
            >
              <span className="font-mono text-5xl">{geojsonData.features.length}</span>
              <span className="">{t('totalCount')}</span>
            </div>
          </div>

          <div className="absolute bg-base-100/50 h-xl map:bottom-0 map:right-[275px] map:rounded-none right-[40px] bottom-3 rounded-[10px] pl-[6px] pr-[6px] flex flex-row items-center">
            <span className="inline-block bg-[#4264fb] w-3 h-3 rounded-full border-2 border-white mr-1"></span>
              {t('mapInfo_1')}
              <span className="inline-block bg-[#7f8c8d] w-3 h-3 rounded-full border-2 border-white ml-1 mr-1"></span>
              {t('mapInfo_2')}
          </div>

          {hoveredClub && (
            <Popup
              longitude={hoveredClub.longitude}
              latitude={hoveredClub.latitude}
              closeButton={false}
              closeOnClick={false}
              offset={10}
              maxWidth="160px"
            >
              <div className="flex flex-col items-center content-center">
                {hoveredClub.logoImage && (
                  <SuspenseImage
                    src={getOptimizedImage(hoveredClub.logoImage, 120)}
                    alt={localize(hoveredClub.name, locale)}
                    placeholderType="club"
                    iconClassName="stroke-20"
                    width={120}
                    height={120}
                    className="object-contain mb-2"
                  />
                )}
                <footer className="pt-sm text-center">
                  <h3 className="font-medium">{localize(hoveredClub.name, locale)}</h3>
                </footer>
              </div>
            </Popup>
          )}
        </Map>
      </div>
    </section>
  );
}