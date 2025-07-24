import { getTranslations } from 'next-intl/server'

export const revalidate = 3600

export default async function HomePage() {
  const t = await getTranslations('HomePage');
  return (
    <main>
      <h1>{t('latestLogos')}</h1>
    </main>
  )
}