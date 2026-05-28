'use client';

import Image from 'next/image';
import { useRef } from 'react';
import { ArrowUpRight, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { getOptimizedImage } from '@/lib/sanity.image';
import { localize } from '@/lib/utils';
import type { NationCategory } from '@/lib/logoCategory.queries';
import type { SubjectTypeKey } from '@/config/logoCategories';
import NationIcon from './_icons/Nation';

type Props = {
  locale: string;
  nations: NationCategory[];
  selectedNationCode?: string;
  selectedSubjectType?: SubjectTypeKey;
  variant?: 'sidebar' | 'card';
};

export default function NationPickerModal({
  locale,
  nations,
  selectedNationCode,
  selectedSubjectType
}: Props) {
  const modalRef = useRef<HTMLDialogElement>(null);
  const tSidebar = useTranslations('CategorySidebar');
  const tCategories = useTranslations('CategoriesPage');

  const openModal = () => {
    modalRef.current?.showModal();
  };

  const closeModal = () => {
    modalRef.current?.close();
  };

  const buildLogoHref = (nationCode: string) => {
    const params = new URLSearchParams();
    params.set('nation', nationCode);

    if (selectedSubjectType) {
      params.set('type', selectedSubjectType);
    }

    const query = params.toString();
    return query ? `/logos?${query}` : '/logos';
  };

  return (
    <>
      <button
        type="button"
        onClick={openModal}
        className="text-sm font-semibold text-success hover:underline underline-offset-4 cursor-pointer flex items-center"
      >
        {tSidebar('allNations')}
        <ArrowUpRight className="h-5 w-5 text-success" />
      </button>

      <dialog ref={modalRef} className="modal">
        <div className="modal-box w-11/12 max-w-6xl p-0 flex flex-col h-[80vh]">
          <div className="relative flex items-start justify-between gap-6 px-6 py-4 mt-4">
            <NationIcon className="h-12 w-12 stroke-[24] text-success shrink-0" />
            <div className="min-w-0 text-left flex-1">
              <h2 className="text-2xl font-bold leading-tight">{tCategories('nationsTitle')}</h2>
              <p className="max-w-2xl text-sm leading-6 text-base-content/70">
                {tCategories('nationsDescription')}
              </p>
            </div>

            <button
              type="button"
              onClick={closeModal}
              className="btn btn-ghost btn-circle btn-sm text-base-content/60 hover:text-base-content"
              aria-label={tCategories('close')}
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="flex-grow overflow-y-auto p-6">
            <div className="grid gap-4 sm:grid-cols-3 xl:grid-cols-4">
              {nations.map((nation) => {
                const nationName = localize(nation.name, locale);
                const active = selectedNationCode === nation.code;

                return (
                  <Link
                    key={nation._id}
                    href={buildLogoHref(nation.code)}
                    className={`group flex items-center gap-4 rounded border border-base-300 px-4 py-2.5 transition-colors ${
                      active
                        ? 'border-success bg-success/10'
                        : 'border-base-200 bg-base-100 hover:border-success hover:bg-success/5'
                    }`}
                  >
                    <span className="flex shrink-0 items-center justify-center overflow-hidden">
                      {nation.flagRectangle ? (
                        <Image
                          src={getOptimizedImage(nation.flagRectangle, 40)}
                          alt={nationName}
                          width={40}
                          height={40}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <span className="text-[10px] font-mono text-base-content/40">
                          {nation.code.slice(0, 2).toUpperCase()}
                        </span>
                      )}
                    </span>

                    <div className="min-w-0 flex-1">
                      <h3 className={`truncate text-sm font-semibold ${active ? 'text-success' : ''}`}>
                        {nationName}
                      </h3>
                      <p className="text-xs font-mono font-bold text-base-content/40">{nation.code.toUpperCase()}</p>
                    </div>

                    <span className="shrink-0 rounded-full bg-neutral/5 px-3 py-1 text-xs font-mono text-base-content/70">
                      {nation.count}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        <form method="dialog" className="modal-backdrop backdrop-blur">
          <button>{tCategories('close')}</button>
        </form>
      </dialog>
    </>
  );
}
