'use client';
import { CloudDownload } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface DownloadCounterProps {
  count: number | null | undefined;
}

export default function DownloadCounter({ count }: DownloadCounterProps) {
  const t = useTranslations('LogoDetailPage');
  const isCountAvailable = count !== null && count !== undefined;
  return (
    <div className="flex items-center justify-start gap-2 font-semibold">
      <CloudDownload className="w-4 h-4" />
      {isCountAvailable ? (
        <span className='text-xs'>
          {t.rich('downloadCount', {
            count: count,
            data: (chunks) => (
              <data className="font-mono mr-xs">{chunks}</data>
            ),
          })}
        </span>
      ) : (
        <data className="font-mono mr-xs">-</data>
      )}
    </div>
  );
}