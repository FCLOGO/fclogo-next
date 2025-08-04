import { localize } from '@/lib/utils';
import type { InternationalizedString } from '@/types';
import { BadgeCheck } from 'lucide-react';
import clsx from 'clsx'; // 导入 clsx

type TimelineEvent = {
  _key: string;
  date: string;
  content: InternationalizedString;
};

type Props = {
  events: TimelineEvent[];
  locale: string;
}

export default function TimelineBlock({ events, locale }: Props) {
  const sortedEvents = events.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  // 将日期转换为 YYYY-MM 格式
  const formattedDate = (date: string) => {
    // 增加一个安全检查，防止无效日期导致崩溃
    if (!date || isNaN(new Date(date).getTime())) {
      return '????-??'; // 如果日期无效，返回一个占位符
    }
    const d = new Date(date);
    return `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}`;
  };
  return (
    <div className='max-w-none bg-base-100 rounded-lg p-12 shadow-box'>
      <ul className="timeline timeline-compact timeline-vertical">
        {sortedEvents.map((event, index) => (
          <li key={event._key} className=''>
            {index > 0 && index < events.length && <hr />}
            <div className="font-mono text-gray-400 text-sm timeline-start">{formattedDate(event.date)}</div>
            <div className="timeline-middle">
              <BadgeCheck className={clsx(
                "w-4 h-4",
                {
                  "text-success": index === 0, // 如果是第一个，使用 success 颜色
                  "text-base-content/40": index > 0, // 其他的使用较浅的颜色
                }
              )} />
            </div>
            <div className="timeline-end pb-2.5">
              <p>{localize(event.content, locale)}</p>
            </div>
            {index < events.length - 1 && <hr />}
          </li>
        ))}
      </ul>
    </div>
  );
}