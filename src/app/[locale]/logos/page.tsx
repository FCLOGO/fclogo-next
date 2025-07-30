import { client } from '@/lib/sanity.client';
import { getLocale, getTranslations } from 'next-intl/server';
import LogoCard from '@/components/LogoCard';
import type { LogoCardQueryResult } from '@/types';

async function getAllLogos(): Promise<LogoCardQueryResult[]> {
  const query = `*[_type == "logo"] | order(dateOriginal desc) {
    slug,
    version,
    isBgDark,
    previewImage,
    subject->{
      name,
      nation->{
        flagSquare
      },
      info {
        shortName
      }
    },
    style->{
      title
    }
  }`;
  try {
    const logos = await client.fetch(query);
    return logos;
  } catch (error) {
    console.error("Failed to fetch latest logos:", error);
    return [];
  }
}

export default async function AllLogosPage() {
  const t = await getTranslations('HomePage');
  const locale = await getLocale();
  const logos = await getAllLogos();

  return (
    <main className="container mx-auto px-6 py-10 flex-grow flex flex-col">
      {logos.length > 0 ? (
        <div className="w-full overflow-hidden grid justify-between gap-6 grid-cols-2 md:grid-cols-[repeat(auto-fill,_minmax(240px,_1fr))]">
          {logos.map((logo: LogoCardQueryResult) => (
            <LogoCard key={logo.slug.current} logo={logo} locale={locale} />
          ))}
        </div>
      ) : (
        <p className="text-center text-base-content/60">
          {t('noData')}
        </p>
      )}
    </main>
  );
}