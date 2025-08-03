'use client';
import { useState, ComponentType } from 'react';
import Image from 'next/image';
import clsx from 'clsx';
import type { ImageProps } from 'next/image';
import LogoIcon from './_icons/Logo';
import ClubIcon from './_icons/Club';
import CompIcon from './_icons/Competition';

interface IconProps {
  className?: string;
}

const presetIcons: Record<string, ComponentType<IconProps>> = {
  logo: LogoIcon,
  club: ClubIcon,
  comp: CompIcon,
};

type SuspenseImageProps = ImageProps & {
  // placeholder prop 可以是一个预设的 key，也可以是一个自定义组件
  placeholderType?: keyof typeof presetIcons | ComponentType<IconProps>;
  iconClassName?: string;
};

export default function SuspenseImage({ 
  placeholderType,
  iconClassName,
  className,
  onLoad,
  alt = '',
  ...rest 
}: SuspenseImageProps) {
  const [isLoading, setIsLoading] = useState(true);

  // 决定最终要渲染哪个图标组件
  let PlaceholderIconComponent: ComponentType<IconProps> | undefined;
  // 如果 placeholder 是一个字符串 (e.g., "logo"), 我们从预设中查找
  if (typeof placeholderType === 'string') {
    PlaceholderIconComponent = presetIcons[placeholderType];
  } 
  // 如果 placeholder 是一个函数 (React 组件就是函数), 我们直接使用它
  else if (typeof placeholderType === 'function') {
    PlaceholderIconComponent = placeholderType;
  }

  return (
    <div className="relative flex items-center justify-center">
      {isLoading && PlaceholderIconComponent && (
        <div className="absolute inset-0 flex items-center justify-center w-full h-full">
          <div className="w-1/2 h-1/2 text-base-content/20">
            <PlaceholderIconComponent className={clsx("w-full h-full stroke-gray-300", iconClassName)} />
          </div>
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