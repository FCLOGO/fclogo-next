import { client } from '@/lib/sanity.client';
import { getTranslations } from 'next-intl/server';
import PageHero from '@/components/PageHero';
import ContributorCard from '@/components/ContributorCard';
import { contributorQueryResult } from '@/types';
import type { Metadata } from 'next';
import { siteConfig } from '@/config/site'; 

export const revalidate = 604800; // 页面每周重新生成一次

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations();

  return {
    title: `${t('ContributionPage.pageTitle')} | ${t('HomePage.pageTitle')}`,
    description: t('HomePage.pageDescription'),
    openGraph: {
      title: `${t('ContributionPage.pageTitle')} | ${t('HomePage.pageTitle')}`,
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
      canonical: `${siteConfig.baseUrl}/contribution`,
      languages: {
        'en-US': `${siteConfig.baseUrl}/contribution/`,
        'zh-CN': `${siteConfig.baseUrl}/zh-cn/contribution/`,
        'x-default': `${siteConfig.baseUrl}/contribution/`
      },
    },
  };
}

async function getAllContributors(): Promise<contributorQueryResult[]> {
  const query = `*[_type == "contributor"]{
    _id,
    name,
    avatar,
    profileUrl,
    "contributionCount": count(*[_type == "logo" && references(^._id)]),
    "recentContributions": *[_type == "logo" && references(^._id)] | order(coalesce(dateOriginal, _createdAt) desc)[0...10]{
      _id,
      previewImage,
      slug
    }
  } | order(contributionCount desc)`;
  try {
    const contributors = await client.fetch(query);
    return contributors;
  } catch (error) {
    console.error("Failed to fetch contributors:", error);
    return [];
  }
}

async function getTotalLogoCount(): Promise<number> {
  try {
    const count = await client.fetch(`count(*[_type == "logo"])`);
    return count;
  } catch (error) {
    console.error("Failed to fetch total logo count:", error);
    return 0;
  }
}

export default async function ContributionPage() {
  const t = await getTranslations('ContributionPage');
  // 并行获取所有需要的数据
  const [contributors, totalLogoCount] = await Promise.all([
    getAllContributors(),
    getTotalLogoCount()
  ]);
  return (
    <>
    <PageHero pageSlogan={t('pageSlogan')} subTitle={t('subTitle')} />
    <main className="container mx-auto px-6 py-10 flex-grow flex flex-col">
      <section className="flex-auto flex flex-col flex-nowrap mb-10 w-full">
        <div className="w-full overflow-hidden grid justify-between gap-8 grid-cols-2 md:grid-cols-[repeat(auto-fill,_minmax(300px,_1fr))]">
          {contributors.map(contributor => (
            <ContributorCard 
              key={contributor._id}
              contributor={contributor}
              totalLogoCount={totalLogoCount}
            />
          ))}
        </div>
      </section>
    </main>
    </>
  )
}