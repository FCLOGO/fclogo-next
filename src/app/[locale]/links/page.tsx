import { client } from '@/lib/sanity.client';
import { LinkQueryResult } from '@/types';
import Image from 'next/image';
import { getOptimizedImage } from '@/lib/sanity.image';
import { getTranslations } from 'next-intl/server';
import { SquareArrowOutUpRight, MailIcon } from 'lucide-react';
import DiscordIcon from '@/components/_icons/Discord';
import type { Metadata } from 'next';
import { siteConfig } from '@/config/site'; 

export const runtime = "edge";
export const revalidate = 604800; // 页面每周重新生成一次

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations();

  return {
    title: `${t('LinksPage.pageTitle')} | ${t('HomePage.pageTitle')}`,
    description: t('HomePage.pageDescription'),
    openGraph: {
      title: `${t('LinksPage.pageTitle')} | ${t('HomePage.pageTitle')}`,
      description: t('HomePage.pageDescription'),
      images: [
        {
          url: `${siteConfig.baseUrl}/logo-share.png`,
          width: 1200, // 推荐的 OG 图片宽度
          height: 630, // 推荐的 OG 图片高度
          alt: 'FCLOGO Website Share Image',
        },
      ],
    },
    alternates: {
      canonical: `${siteConfig.baseUrl}/links`,
      languages: {
        'en-US': `${siteConfig.baseUrl}/links/`,
        'zh-CN': `${siteConfig.baseUrl}/zh-cn/links/`,
        'x-default': `${siteConfig.baseUrl}/links/`
      },
    },
  };
}


async function getAllLinks(): Promise<LinkQueryResult[]> {
  const query = `*[_type == "link"] | order(orderRank asc){
    _id,
    name,
    url,
    logo,
    description
  }`;
  try {
    const links = await client.fetch(query);
    return links;
  } catch (error) {
    console.error("Failed to fetch links:", error);
    return [];
  }
}

const ContactLinks = [
  {
    title: 'Mail',
    link: 'mailto:info@fclogo.top',
    icon: <MailIcon className="w-full h-full fill-light-gray hover:fill-dark-gray" />
  },
  {
    title: 'Discord',
    link: 'https://discord.gg/gVcbysaEWD',
    icon: <DiscordIcon className="w-full h-full fill-light-gray hover:fill-dark-gray" />
  }
]

export default async function LinksPage() {
  const t = await getTranslations('LinksPage');
  const links = await getAllLinks();
  return (
    <main className="container mx-auto px-6 py-10 flex-grow flex flex-col">
      <section className="flex-auto flex flex-col flex-nowrap mb-10 w-full">
        <div className="w-full overflow-hidden grid justify-between gap-8 grid-cols-2 md:grid-cols-[repeat(auto-fill,_minmax(300px,_1fr))]">
          {links.map(link => (
            <article
              key={link._id}
              className="bg-base-100 rounded-lg shadow-box w-full relative overflow-hidden flex flex-col flex-nowrap items-center justify-between gap-2"
            >
              <div className='relative w-full h-30 overflow-hidden'>
                <Image
                  src={getOptimizedImage(link.logo, 100)} 
                  alt=""
                  fill 
                  className="object-cover blur-lg opacity-40"
                />
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="absolute inset-0 flex items-center justify-center p-4">
                  <Image
                    src={getOptimizedImage(link.logo, 64)}
                    alt={link.name}
                    width={64}
                    height={64}
                    className="object-contain drop-shadow-lg rounded-full border-4 border-base-100/50"
                  />
                </div>
              </div>
              <div className="w-full p-4 flex-grow overflow-hidden flex flex-col flex-nowrap items-center gap-2">
                <h3 className="font-semibold text-sm line-clamp-1">{link.name}</h3>
                <p className="text-xs text-gray-400 text-center w-full">{link.description}</p>
              </div>
              <a 
                href={link.url}
                className='btn btn-primary rounded-full m-6 mt-auto'
                target="_blank" 
                rel="noopener noreferrer">
                {t('visitPage')}
                <SquareArrowOutUpRight className="w-3.5 h-3.5" />
              </a>
            </article>
          ))}
        </div>
      </section>
      <section className="w-full flex flex-col items-center mb-20">
        <h2 className="text-2xl uppercase font-semibold tracking-wider mb-2 indent-4">
          {t('exchangelinks')}
        </h2>
        <p className="uppercase font-medium mb-2">{t('contactus')}</p>
        <ul className="flex flex-row flex-nowrap justify-center items-center gap-4">
          {ContactLinks.map((item, index) => (
            <li key={index} className="w-6 h-6">
              <a href={item.link} rel="noopener noreferrer" target="_blank">
                {item.icon}
              </a>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}