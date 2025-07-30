import React from 'react';
import { localize } from '@/lib/utils';
import type { FullLogoQueryResult } from '@/types';
import { ImageIcon, SplinePointer, Hash, UserRoundPlus, BugIcon } from 'lucide-react';
import { getOptimizedImage } from '@/lib/sanity.image';
import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import DownloadCounter from './DownloadCounter';
import XIcon from './_icons/X';
import WeiboIcon from './_icons/Weibo';
import WikiIcon from './_icons/Wiki';
import WebsiteIcon from './_icons/Website';


type Props = {
  logo: FullLogoQueryResult;
  locale: string;
}

export default async function LogoDetailPage({ logo, locale }: Props) {
  const t = await getTranslations('LogoDetailPage');
  const subjectName = localize(logo.subject.name, locale);
  const subjectInfo = logo.subject.info;
  const socialLinks = logo.subject.socialLinks;
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
    <aside className='w-full lg:w-md h-full bg-base-100 flex flex-col border-l border-gray-200 gap-4'>
      {/* 标题 */}
      <header className='flex flex-col gap-2 px-6 pt-6'>
        <section className='flex items-center gap-2'>
          {logo.subject.nation?.flagRectangle && (
            <Image
              src={getOptimizedImage(logo.subject.nation.flagRectangle, 28)}
              alt={localize(logo.subject.nation?.name, locale)}
              width={28}
              height={28}
              className="object-contain"
            />
          )}
          {logo.version === 0 ? '' : (
            <span className="badge badge-sm badge-outline badge-success font-mono flex-none font-semibold py-2.5">
              {`v${logo.version}${logo.isDoubtful ? ('?') : ('')}`}
            </span>
          )}
          {logo.isOutdated && (
            <span className="badge badge-sm badge-outline badge-success flex-none font-semibold uppercase py-2.5">
              {t('outdated')}
            </span>
          )}
        </section>
        <section className='flex items-center justify-between gap-2'>
          <h1 className="text-lg capitalize flex-auto font-bold">{`${subjectName}${t('titleVector')}`}</h1>
          {logo.subject.status === "inactive" && (
            <span className='badge badge-sm badge-outline badge-error flex-none font-semibold py-2.5 uppercase'>
              {t('inactive')}
            </span>
          )}
        </section>
      </header>
      {/* 下载按钮 */}
      <div className='flex flex-nowrap justify-between items-center gap-4 px-6'>
        <a href={logo.pngUrl} target="_blank" rel="noopener noreferrer" className='w-full bg-primary hover:bg-secondary text-primary-content flex flex-nowrap flex-auto items-center h-12 rounded transition-colors duration-600'>
          <span className='font-mono text-lg font-bold w-full flex-auto text-center'>PNG</span>
          <ImageIcon className='flex-none w-12 h-12 p-3 border-l border-l-base-100/30 bg-secondary rounded-r' />
        </a>
        <a href={logo.svgUrl} target="_blank" rel="noopener noreferrer" className='w-full bg-primary hover:bg-secondary text-primary-content flex flex-nowrap items-center h-12 rounded transition-colors duration-600'>
          <span className='font-mono text-lg font-bold w-full flex-auto text-center'>SVG</span>
          <SplinePointer className='flex-none w-12 h-12 p-3 border-l border-l-base-100/30 bg-secondary rounded-r' />
        </a>
      </div>
      {/* 下载提示 */}
      <div className='flex flex-col gap-4 px-6'>
        <p className='flex items-center text-xs font-semibold gap-1.5'>
          <SplinePointer className='w-4 h-4' />
          {t('editTips')}
          <Link href="/support/how-to-edit-vector-file" className="underline decoration-dotted hover:decoration-solid underline-offset-4 hover:text-primary">
            {t('howToEdit')}
          </Link>
        </p>
        <section className='flex flex-col gap-2 mt-2'>
          <h3 className="font-semibold text-sm">{t('termTitle')}</h3>
          <p className='text-xs'>
            {t.rich(`termText`, { 
              name: subjectName,
              important: (chunks: React.ReactNode) => (
                <span className="font-bold">
                  {chunks}
                </span>
              )
            })}
            <Link href="/support/terms-of-use" className="underline decoration-dotted hover:decoration-solid underline-offset-4 hover:text-primary">
              <b>{t('termMore')}</b>
            </Link>
          </p>
        </section>
        <section className='flex flex-col gap-2 mt-2'>
          <DownloadCounter count={1156} />
        </section>
      </div>
      {/* 详细信息 */}
      <div className='flex flex-col gap-2 mt-2 px-6 pt-6 border-t border-t-base-300'>
        <h3 className="font-semibold text-sm">
          {`${t(logo.subject._type)}${t('infoTitle')}`}
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
        {logo.alternateNames && logo.alternateNames.length > 0 && (
          <div className='mt-4'>
            <ul className='flex flex-row flex-wrap items-center gap-2 text-xs'>
              {logo.alternateNames.map(name => (
                <li key={name} className='badge badge-sm badge-outline badge-gray-300 flex flex-row flex-nowrap items-center gap-0.5 text-base-content/50'>
                  <Hash className='w-3 h-3'/>
                  {name}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      {/* 其他信息 */}
      <div className='flex flex-col gap-4 mt-2 p-6 border-t border-t-base-300'>
        {logo.contributor && (
          <p className='text-xs font-semibold flex flex-nowrap items-center'>
            <UserRoundPlus className='w-4 h-4 mr-2' />
            {t('contributor')}
            {logo.contributor.profileUrl ? (
              <a 
              href={logo.contributor.profileUrl}
              rel="noopener noreferrer"
              target="_blank"
              className='ml-1 underline decoration-dotted hover:decoration-solid underline-offset-4 hover:text-primary'
              >
              @{logo.contributor.name}
              </a>
            ) : (
              <span className='ml-1'>@{logo.contributor.name}</span>
            )}
          </p>
        )}
        <p className='text-xs font-semibold flex flex-nowrap items-center'>
          <BugIcon className='w-4 h-4 mr-2' />
          {t('foundErr')}
          <a
            href="mailto:info@fclogo.top"
            rel="noopener noreferrer"
            target="_blank"
            className="ml-1 underline decoration-dotted hover:decoration-solid underline-offset-4 hover:text-primary"
          >
            {t('tellMe')}
          </a>
        </p>
      </div>
    </aside>
  )
}