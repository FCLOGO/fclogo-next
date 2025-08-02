'use client';
import { useState } from 'react';
import Image from 'next/image';
import clsx from 'clsx';
import type { ImageProps } from 'next/image';

// 我们可以继承 Next/Image 的所有 props，让这个组件更通用
type SuspenseImageProps = ImageProps & {
  // 你可以添加一些自定义的 props，比如 loading animation 的大小
  loadingSpinnerSize?: 'loading-xs' | 'loading-sm' | 'loading-md' | 'loading-lg';
};

export default function SuspenseImage({ 
  loadingSpinnerSize = 'loading-md', 
  className,
  onLoad,
  alt = '',
  ...rest 
}: SuspenseImageProps) {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="relative flex items-center justify-center">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={clsx("loading loading-spinner", loadingSpinnerSize)}></span>
        </div>
      )}
      <Image
        className={clsx(
          className, 
          'transition-opacity duration-300',
          {
            'opacity-0': isLoading,
            'opacity-100': !isLoading,
          }
        )}
        alt={alt}
        // 当图片加载完成时，触发 onLoad 回调
        onLoad={(e) => {
          setIsLoading(false);
          // 如果外部也传了 onLoad，我们继续调用它
          if (onLoad) {
            onLoad(e);
          }
        }}
        {...rest} 
      />
    </div>
  );
}