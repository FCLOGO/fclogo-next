import type { FullPackQueryResult } from '@/types';
import PackHeader from './PackHeader';
import SidebarDetails from './SidebarDetails';
import SidebarMeta from './SidebarMeta';


type Props = {
  pack: FullPackQueryResult;
  locale: string;
}

export default function PackSidebar({ pack, locale }: Props) {
  return (
    <aside className='w-full flex-shrink-0 lg:w-md h-full bg-base-100 flex flex-col border-l border-gray-200 gap-4'>
      <PackHeader pack={pack} locale={locale} />
      <SidebarDetails subject={pack.sourceSubject} locale={locale} />
      <SidebarMeta />
    </aside>
  )
}