'use client';
import { Link, usePathname } from '@/i18n/navigation';
import type { ComponentProps } from 'react';
import clsx from 'clsx';

type NavLinkProps = ComponentProps<typeof Link> & {
  activeClassName?: string;
  exact?: boolean;
};

export default function NavLink({ 
  href, 
  activeClassName, 
  className, 
  exact = false, 
  ...rest 
}: NavLinkProps) {
  const pathname = usePathname();

  const isActive = exact
    ? pathname === href // 精确匹配
    : (href === '/' ? pathname === href : pathname.startsWith(href as string)); // 旧的、层级式匹配

  const combinedClassName = clsx(className, {
    [activeClassName || '']: isActive, // 只有当 isActive 为 true 时才添加 activeClassName
  });

  return <Link href={href} className={combinedClassName} {...rest} />;
}