import type { Metadata } from "next";
import "./globals.css";
import { JetBrains_Mono} from "next/font/google";
import {NextIntlClientProvider, hasLocale} from 'next-intl';
import { getMessages } from 'next-intl/server';
import {notFound} from 'next/navigation';
import {routing} from '@/i18n/routing';
import Header from '@/components/Header';
import Footer from "@/components/Footer";
import DrawerMenu from "@/components/DrawerMenu";
import FloatingActionGroup from "@/components/FloatingActionGroup";
import SearchModal from '@/components/SearchModal';
import { siteConfig } from '@/config/site'; 
import { Adsense } from '@/components/Adsense';

const jetBrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: 'Collection of Football Club Vector Logos - FCLOGO',
    template: '%s - FCLOGO',
  },
  description: "Collection of football club vector logos. All logos work with SVG and PNG. No account and unlimited downloads for free.",
  keywords: `football,football club,logo,vector,vector logo,football logo,football badge,football crest,AI,SVG`,
  alternates: {
    canonical: siteConfig.baseUrl,
    languages: {
      'en-US': `${siteConfig.baseUrl}/`,
      'zh-CN': `${siteConfig.baseUrl}/zh-cn/`,
      'x-default': `${siteConfig.baseUrl}/`,
    }
  },
  openGraph: {
    type: 'website',
    locale: 'en_US', // 默认的 Open Graph 语言
    url: siteConfig.baseUrl,
    title: {
      default: 'Collection of Football Club Vector Logos - FCLOGO',
      template: '%s - FCLOGO',
    },
    description: "Collection of football club vector logos. All logos work with SVG and PNG. No account and unlimited downloads for free.",
    siteName: siteConfig.name,
    images: [
      {
        url: `${siteConfig.baseUrl}/logo-share.png`,
        width: 1200, // 推荐的 OG 图片宽度
        height: 630, // 推荐的 OG 图片高度
        alt: 'FCLOGO Website Share Image',
      },
    ],
  },
};

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode
  params: Promise<{locale: string}>
}) {
  const {locale} = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  const messages = await getMessages();
  return (
    <html lang={locale} data-theme="light">
      <head><Adsense /></head>
      <body className={`${jetBrainsMono.variable} antialiased`}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <div className="drawer">
            <input id="main-drawer" type="checkbox" className="drawer-toggle" />
            <div className="drawer-content flex flex-col bg-base-300 min-h-screen">
              <Header />
              {children}
              <Footer />
              <FloatingActionGroup />
            </div>
            <DrawerMenu />
          </div>
          <SearchModal />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
