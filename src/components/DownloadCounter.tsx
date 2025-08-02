'use client';
import { CloudDownload } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface DownloadCounterProps {
  count: number | null | undefined;
  isUpdating?: boolean;
}

export default function DownloadCounter({ count, isUpdating }: DownloadCounterProps) {
  const t = useTranslations('DetailPage');
  const isCountAvailable = count !== null && count !== undefined;
  return (
    <div className="flex items-center justify-start gap-2 font-semibold">
      <CloudDownload className="w-4 h-4" />
      {isUpdating ? (
        // 如果正在更新，显示一个小的加载动画
        <span className="loading loading-dots loading-xs"></span>
      ) : (
        // 否则，显示正常的计数值
        isCountAvailable ? (
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
        )
      )}
    </div>
  );
}