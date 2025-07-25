'use client';
import { Link, usePathname } from '@/i18n/navigation';
import type { ComponentProps } from 'react';

type NavLinkProps = ComponentProps<typeof Link> & {
  activeClassName?: string;
};

export default function NavLink({ href, activeClassName, className, ...rest }: NavLinkProps) {
  const pathname = usePathname();
  // 判断当前路径是否以链接的 href 开头
  // 对于 href="/", 需要完全匹配
  const isActive = href === '/' ? pathname === href : pathname.startsWith(href as string);
  const combinedClassName = `${className} ${isActive ? activeClassName : ''}`;
  return <Link href={href} className={combinedClassName} {...rest} />;
}