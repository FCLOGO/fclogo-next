// 'use client'; 
import { Link } from '@/i18n/navigation';
import { getLocale, getTranslations } from 'next-intl/server'
import { siteConfig } from '@/config/site'; 
import FooterStats from './FooterStats';
import Logo from './_icons/FCLOGO';

export default async function Footer() {
  const t = await getTranslations('Footer');
  const locale = await getLocale();

  const footerLinks = [
      { name: t('about'), href: '/about' },
      { name: t('termsOfUse'), href: '/support/terms-of-use' },
      { name: t('links'), href: '/links' },
  ];

  return (
    <footer className="flex flex-col text-neutral-content bg-neutral">
      <div className="container mx-auto px-6 pt-10 pb-6">
        <div className="flex flex-col items-center gap-6 lg:items-start">
          <Link href="/" aria-label={t('backToHome')} className='mb-4'>
            <Logo className="h-5 w-auto fill-current [&_.path-2]:fill-success" />
          </Link>

          <div className="flex flex-col items-center lg:items-end gap-8 lg:flex-row justify-between w-full">
            <FooterStats locale={locale} />
            <div className='flex flex-col items-center lg:items-end gap-6'>
              <div className="flex items-center gap-6">
                {siteConfig.socialLinks.map(({ name, href, Icon }) => (
                  <a 
                    key={name}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="fill-neutral-content opacity-70 hover:opacity-100 transition-opacity"
                    aria-label={name}
                  >
                    <Icon className="h-5 w-5" />
                  </a>
                ))}
              </div>
              <ul className="flex items-center justify-center lg:justify-end flex-wrap gap-6 text-sm">
                {footerLinks.map(({ name, href }) => (
                  <li key={name}>
                    <Link href={href} className="opacity-60 hover:opacity-100 transition-opacity uppercase font-medium" aria-label={name}>
                      {name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-gray-900/50 border-t border-neutral-content/10">
        <div className="container mx-auto p-6 flex flex-col items-center text-center gap-4 lg:flex-row lg:justify-between lg:items-end lg:text-left text-xs text-neutral-content/40">
          <div className="lg:flex-1">
            <p>{t('license')}</p>
          </div>
          <div className="lg:flex-shrink-0">
            <p>COPYRIGHT © {new Date().getFullYear()}, <a href="https://fclogo.top/" target="_blank" rel="nofollow" className="hover:text-neutral-content">FCLOGO.TOP</a> ALL RIGHT RESERVED</p>
          </div>
        </div>
      </div>
    </footer>
  );
};