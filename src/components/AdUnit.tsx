// src/components/AdUnit.tsx
'use client';

import { useEffect } from 'react';

type AdUnitProps = {
  adSlot: string; // 广告单元 ID
  adFormat?: string; // "auto", "rectangle", "vertical", etc.
  layoutKey?: string;
  className?: string; // 用于自定义样式的容器 class
};

export default function AdUnit({ 
  adSlot, 
  adFormat = 'auto', 
  layoutKey = '', 
  className = '' 
}: AdUnitProps) {
  useEffect(() => {
    // 每次组件挂载时，尝试推送一次广告请求
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
    } catch (err) {
      console.error("AdSense error:", err);
    }
  }, []);

  // 只在生产环境中渲染广告
  if (process.env.NODE_ENV !== 'production') {
    // 在开发环境中，显示一个清晰的占位符
    return (
      <div className={`flex items-center justify-center bg-gray-200 text-gray-500 text-sm h-24 ${className}`}>
        Adsense (Slot: {adSlot})
      </div>
    );
  }

  return (
    <div className={className}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-9573165480183467"
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-ad-layout-key={layoutKey}
        data-full-width-responsive="true"
      ></ins>
    </div>
  );
}