'use client';
import React from 'react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { X, Check } from 'lucide-react';

type Props = {
  modalRef: React.RefObject<HTMLDialogElement | null>;
  isDownloading: boolean;
  isCompleted: boolean;
  countdown: number;
  downloadUrl: string;
  onClose: () => void;
  onTriggerDownload: (url: string) => void;
};

export default function DownloadModal({ modalRef, isDownloading, isCompleted, countdown, downloadUrl, onClose, onTriggerDownload}: Props) {
  const t = useTranslations('LogoDetailPage');
  // 根据当前状态决定模态框的 UI
  const renderModalContent = () => {
    if (isCompleted) {
      return {
        title: t('downloadDone'),
        content: <Check className='w-12 h-12 text-success' />
      };
    }
    if (isDownloading) {
      return {
        title: t('preparingDownload'),
        content: <div className="loading loading-spinner loading-lg text-primary"></div>
      };
    }
    // 默认是倒计时状态
    return {
      title: t('startDownload'),
      content: <span className="text-4xl font-mono font-bold">{countdown}</span>
    };
  };

  const modalState = renderModalContent();
  return (
    <dialog ref={modalRef} className="modal">
      <div className="modal-box w-11/12 max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-8 p-0">
        <button 
          onClick={onClose}
          className="btn btn-sm btn-circle btn-ghost absolute right-4 top-4 z-20"
        >
          <X />
        </button>
        {/* 左侧广告位 */}
        <div className="bg-base-200 hidden md:flex items-center justify-center">
          <span className="text-base-content/50">广告位占位符</span>
        </div>
        {/* 右侧下载逻辑 */}
        <div className="flex flex-col items-center justify-center px-10 py-20 gap-6">
          <h3 className="font-bold text-xl">
            {modalState.title}
          </h3>
          <div className="grid place-items-center">
            <div 
              className="radial-progress text-base-300" 
              style={{ "--value": 100, "--size": "8rem" } as React.CSSProperties} 
              role="progressbar"
            ></div>
            <div 
              className="radial-progress text-primary absolute"
              style={{ "--value": (5 - countdown) * 20, "--size": "8rem" } as React.CSSProperties}
              role="progressbar"
            >
              {modalState.content}
            </div>
          </div>
          {(isCompleted || isDownloading) ? (
            <p className="text-sm text-center">
              {t('downloadTips')}
              <button onClick={() => onTriggerDownload(downloadUrl)} className="font-bold link link-primary underline-offset-4">
                {t('clickHere')}
              </button>
            </p>
          ) : (
            <p className="text-sm text-center">
              {t('autoDownloadTips')}
            </p>
          )}
          <a href="https://www.buymeacoffee.com/fclogo" target="_blank">
            <Image
              src="/buy-me-a-coffee.png" 
              alt="Buy Me A Coffee" 
              width={160}
              height={45} 
            />
          </a>
        </div>
      </div>
    </dialog>
  );
}