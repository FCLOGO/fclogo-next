'use client'; 
import { Link } from '@/i18n/navigation';
import NavLink from './NavLink'
import { menuConfig } from '@/i18n/menuConfig'
import Logo from '@/components/_icons/FCLOGO';
import { useTranslations } from 'next-intl';
import { Menu, Upload } from 'lucide-react';

export default function Header() {
  const t = useTranslations('Header');
  const topMenuLinkClass = "inline-block uppercase h-16 leading-[4rem] transition-[border-bottom] hover:border-b-4 border-success";
  const activeTopMenuLinkClass = "border-b-4 border-success";
  const menuItems = (
    <>
      {menuConfig.map((item) => (
        <li key={item.href}>
          <NavLink 
            href={item.href} 
            className={topMenuLinkClass} 
            activeClassName={activeTopMenuLinkClass}
          >
            {t(item.translationKey as string)}
          </NavLink>
        </li>
      ))}
    </>
  );

  return (
    <header className="sticky top-0 w-full z-100 transition-colors duration-600 text-primary-content bg-primary">
      <nav className="navbar mx-auto h-16 p-6">
        <div className="navbar-start">
          <label htmlFor="main-drawer" className="cursor-pointer rounded-md drawer-button flex lg:hidden">
            <Menu />
          </label>
          <Link href="/" className="hidden lg:flex items-center">
            <Logo className="h-5 w-auto [&_>.path-2]:fill-success fill-white" />
          </Link>
        </div>
        <div className="navbar-center">
          <Link href="/" className="flex lg:hidden items-center">
            <Logo className="h-5 w-auto [&_>.path-2]:fill-success fill-white" />
          </Link>
          <ul className="px-1 ml-8 font-bold text-[16px] items-center space-x-6 hidden lg:flex">
            {menuItems}
          </ul>
        </div>
        <div className="navbar-end">
          <button className="shadow-none border-none outline-none btn btn-success rounded inline-flex uppercase transition-colors hover:bg-warning">
            <Upload className="mr-1 w-4 h-4" />
            {t('submitLogo')}
          </button>
        </div>
      </nav>
    </header>
  );
}