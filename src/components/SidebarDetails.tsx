'use client';
import React from 'react';
import { localize } from '@/lib/utils';
import { useTranslations } from 'next-intl';
import type { FullLogoQueryResult, FullPackQueryResult } from '@/types';
import { Hash } from 'lucide-react';
import AdUnit from './AdUnit';
import XIcon from './_icons/X';
import WeiboIcon from './_icons/Weibo';
import WikiIcon from './_icons/Wiki';
import WebsiteIcon from './_icons/Website';

type DetailsProps = {
  subject: FullLogoQueryResult['subject'] | FullPackQueryResult['sourceSubject']; 
  alternateNames?: FullLogoQueryResult['alternateNames'];
  locale: string;
};

export default function LogoDetailPage({ subject, locale, alternateNames }: DetailsProps) {
  const t = useTranslations('DetailPage');
  const subjectName = localize(subject.name, locale);
  const subjectInfo = subject.info;
  const socialLinks = subject.socialLinks;
  // 详细信息
  const details = [
    { label: 'fullName', value: subjectName },
    { label: 'shortName', value: subjectInfo?.shortName ? localize(subjectInfo.shortName, locale) : '' },
    { label: 'localName', value: subjectInfo?.localName },
    { label: 'founded', value: subjectInfo?.founded },
    { label: 'city', value: subjectInfo?.city ? localize(subjectInfo.city, locale) : '' },
    { label: 'ground', value: subjectInfo?.ground ? localize(subjectInfo.ground, locale) : '' },
    { label: 'duration', value: subjectInfo?.duration },
    { label: 'association', value: subjectInfo?.association },
    { label: 'confederation', value: subjectInfo?.confederation },
    { label: 'level', value: subjectInfo?.level ? localize(subjectInfo.level, locale) : '' },
    { label: 'promotion', value: subjectInfo?.promotion ? localize(subjectInfo.promotion, locale) : '' },
    { label: 'relegation', value: subjectInfo?.relegation ? localize(subjectInfo.relegation, locale) : '' },
    { label: 'teams', value: subjectInfo?.teams },
    { label: 'affiliations', value: subjectInfo?.affiliations },
    { label: 'headquarter', value: subjectInfo?.headquarter ? localize(subjectInfo.headquarter, locale) : '' },
  ];
  // 社交媒体链接
  const Links = [
    { url: socialLinks.websiteURL, icon: WebsiteIcon },
    { url: socialLinks.weiboURL, icon: WeiboIcon },
    { url: socialLinks.twitterURL, icon: XIcon },
    { url: socialLinks.wikiURL, icon: WikiIcon },
  ];
  return (
    <>
      <div className="mt-2 px-6">
          <AdUnit adSlot="5850965230" adFormat='fluid' layoutKey='-e0+7z-36-93+si' /> 
      </div>
      <div className='flex flex-col gap-2 mt-2 px-6 pt-6 border-t border-t-base-300'>
        <h3 className="font-semibold text-sm">
          {`${t(subject._type)}${t('infoTitle')}`}
        </h3>
        <table className="text-xs">
          <tbody>
            {details.map(item => item.value ? (
              <tr key={item.label}>
                <th className="text-left py-2 pr-2">{t(item.label)}</th>
                <td>{item.value}</td>
              </tr>
            ) : null)}
          </tbody>
        </table>
        {/* 相关链接 */}
        {Links && Links.length > 0 && (
          <div className='flex flex-row gap-1 mt-4'>
            {Links.filter(({ url }) => !!url).map(({ url, icon }) => (
              <a 
                key={url}
                href={url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="h-10 w-10 p-2.5 hover:bg-neutral/10 rounded"
              >
                {React.createElement(icon, { className: "w-5 h-5" })}
              </a>
            ))}
          </div>
        )}
        {/* 曾用名 */}
        {alternateNames && alternateNames.length > 0 && (
          <div className='mt-4'>
            <ul className='flex flex-row flex-wrap items-center gap-2 text-xs'>
              {alternateNames.map(name => (
                <li key={name} className='badge badge-sm badge-outline badge-gray-300 flex flex-row flex-nowrap items-center gap-0.5 text-base-content/50'>
                  <Hash className='w-3 h-3'/>
                  {name}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </>
  );
}