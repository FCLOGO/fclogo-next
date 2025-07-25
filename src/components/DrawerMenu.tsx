'use client'; 
import NavLink from './NavLink'
import { menuConfig } from '@/i18n/menuConfig';
import { useTranslations } from 'next-intl';

export default function DrawerMenu() {
  const t = useTranslations("Header");

  return (
    <aside className="drawer-side z-100 lg:hidden">
      <label htmlFor="main-drawer"  aria-label="close sidebar" className="drawer-overlay"></label>
      <div className="p-4 pt-16 w-80 min-h-full bg-base-200 text-base-content">
        <ul className="menu bg-base-200 w-full text-base space-y-2.5">
        {menuConfig.map((item) => (
          <li key={item.href}>
            <NavLink href={item.href} className="rounded-md" activeClassName="bg-primary text-primary-content">
              {t(item.translationKey as string)}
            </NavLink>
          </li>
        ))}
        </ul>
      </div>
    </aside>
  );
}
