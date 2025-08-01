'use client';

import React, { useState, useEffect, useRef } from 'react';
import type { FullLogoQueryResult } from '@/types';
import SidebarHeader from './SidebarHeader';
import SidebarDownload from './SidebarDownload';
import SidebarDetails from './SidebarDetails';
import SidebarMeta from './SidebarMeta';
import DownloadModal from './DownloadModal';

type Props = {
  logo: FullLogoQueryResult;
  locale: string;
}

export default function LogoDetailPage({ logo, locale }: Props) {
  const [countdown, setCountdown] = useState(5);
  const [downloadUrl, setDownloadUrl] = useState('');
  const [isDownloading, setIsDownloading] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const modalRef = useRef<HTMLDialogElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // 创建一个专门的下载触发函数
  const triggerDownload = async (url: string): Promise<boolean> => {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = blobUrl;
      link.setAttribute('download', url.substring(url.lastIndexOf('/') + 1));
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
      return true; // 下载成功
    } catch (error) {
      console.error("Download failed:", error);
      window.open(url, '_blank');
      return false; // 下载失败
    }
  };
  // 处理下载点击事件
  const handleDownloadClick = (url: string) => {
    setDownloadUrl(url);
    setCountdown(5); // 重置倒计时
    setIsDownloading(false); // 重置下载状态
    setIsCompleted(false); // 重置完成状态
    modalRef.current?.showModal(); // 打开 daisyUI 模态框
  };
  // 使用 useEffect 处理倒计时和自动下载
  useEffect(() => {
    if (countdown > 0 && modalRef.current?.open) {
      timerRef.current = setTimeout(() => {
        setCountdown(prev => prev - 1);
      }, 1000);
    } else if (countdown === 0 && !isDownloading && !isCompleted) {
      setIsDownloading(true); // 进入“正在准备”状态
      
      const startDownload = async () => {
        if (downloadUrl) {
          await triggerDownload(downloadUrl);
          // 阶段三：准备完成，标记为已完成
          setIsCompleted(true);
        }
        setIsDownloading(false); // 无论成功失败，都结束“正在准备”状态
      };
      
      startDownload();
    }
    // 清理函数：当组件卸载或依赖项变化时，清除定时器
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [countdown, downloadUrl, isDownloading, isCompleted]);

  // 手动关闭模态框并重置状态
  const handleCloseModal = () => {
    if (timerRef.current) clearTimeout(timerRef.current); // 确保关闭时停止计时器
    setCountdown(5); // 重置倒计时
    setDownloadUrl(''); // 清空下载链接
    setIsDownloading(false); // 重置下载状态
    setIsCompleted(false); // 重置完成状态
    modalRef.current?.close();
  }
  return (
    <aside className='w-full lg:w-md h-full bg-base-100 flex flex-col border-l border-gray-200 gap-4'>
      <SidebarHeader logo={logo} locale={locale} />
      <SidebarDownload 
        logo={logo} locale={locale}
        onDownloadClick={handleDownloadClick}
      />
      <SidebarDetails logo={logo} locale={locale} />
      <SidebarMeta contributor={logo.contributor} />
      <DownloadModal 
        modalRef={modalRef}
        isDownloading={isDownloading}
        isCompleted={isCompleted}
        countdown={countdown}
        downloadUrl={downloadUrl}
        onClose={handleCloseModal}
        onTriggerDownload={triggerDownload}
      />
    </aside>
  )
}