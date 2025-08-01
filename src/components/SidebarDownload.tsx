'use client';
import { localize } from '@/lib/utils';
import type { FullLogoQueryResult } from '@/types';
import { ImageIcon, SplinePointer } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import DownloadCounter from './DownloadCounter';

type Props = {
  logo: FullLogoQueryResult;
  locale: string;
  onDownloadClick: (url: string) => void;
  downloadCount: number;
  isCountUpdating: boolean;
};

export default function SidebarDownload({ logo, locale, onDownloadClick, downloadCount, isCountUpdating }: Props) {
  const t = useTranslations('LogoDetailPage');
  const subjectName = localize(logo.subject.name, locale);
  return (
    <>
      {/* 下载按钮 */}
      <div className='flex flex-nowrap justify-between items-center gap-4 px-6'>
        <button onClick={() => onDownloadClick(logo.pngUrl)} className='w-full bg-primary hover:bg-secondary text-primary-content flex flex-nowrap flex-auto items-center h-12 rounded transition-colors duration-600 cursor-pointer'>
          <span className='font-mono text-lg font-bold w-full flex-auto text-center'>PNG</span>
          <ImageIcon className='flex-none w-12 h-12 p-3 border-l border-l-base-100/30 bg-secondary rounded-r' />
        </button>
        <button onClick={() => onDownloadClick(logo.svgUrl)} className='w-full bg-primary hover:bg-secondary text-primary-content flex flex-nowrap flex-auto items-center h-12 rounded transition-colors duration-600 cursor-pointer'>
          <span className='font-mono text-lg font-bold w-full flex-auto text-center'>SVG</span>
          <SplinePointer className='flex-none w-12 h-12 p-3 border-l border-l-base-100/30 bg-secondary rounded-r' />
        </button>
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
          <DownloadCounter count={downloadCount} isUpdating={isCountUpdating} />
        </section>
      </div>
    </>
  )
}