'use client';

import Script from 'next/script';

const ADSENSE_PUBLISHER_ID = 'pub-9573165480183467';

export const Adsense = () => {

  if (process.env.NODE_ENV !== 'production') {
    return null; // 只在生产环境中加载广告
  }

  return (
    <Script
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-${ADSENSE_PUBLISHER_ID}`}
      crossOrigin="anonymous"
      key="google-adsense"
    />
  );
};