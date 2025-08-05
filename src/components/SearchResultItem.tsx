import type { LogoSearchResult } from '@/types';
import { Link } from '@/i18n/navigation';
import SuspenseImage from './SuspenseImage';
import { ArrowRight } from 'lucide-react';

type Props = {
  result: LogoSearchResult;
  locale: string;
}

export default function SearchResultItem({ result, locale }: Props) {
  // 根据当前语言决定显示哪个名称/样式
  const subjectName = locale === 'zh-cn' ? result.subject_name_zh : result.subject_name;
  const styleName = locale === 'zh-cn' ? result.style_name_zh : result.style_name;
  
  return (
    <Link 
      href={result.slug}
      className="group flex items-center gap-4 px-4 py-2 bg-gray-300/20 rounded hover:bg-success hover:text-success-content transition-all duration-200"
    >
      {/* 左侧预览图 */}
      <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center">
        {result.preview_image_url && (
          <SuspenseImage 
            src={result.preview_image_url}
            alt={subjectName}
            placeholderType="logo"
            iconClassName="stroke-20"
            width={48}
            height={48}
            className="w-full h-full object-contain"
          />
        )}
      </div>

      {/* 中间信息 */}
      <div className="flex-1 flex flex-col justify-center text-left">
        <h3 className="font-semibold text-base text-base-content group-hover:text-success-content">{subjectName}</h3>
        <p className="text-sm text-base-content/70 group-hover:text-success-content/70">
          {result.subject_local_name}
        </p>
      </div>

      {/* 右侧标签和箭头 */}
      <div className="flex-shrink-0 flex items-center gap-2 text-base-content group-hover:text-success-content">
        {result.version !== 0 && (
          <span className="badge badge-sm badge-outline font-mono">
            {String(result.version)}
          </span>
        )}
        <span className="badge badge-sm badge-outline">{styleName}</span>
      </div>
      <ArrowRight className="text-sm text-base-content group-hover:text-success-content hidden sm:block" />
    </Link>
  );
}