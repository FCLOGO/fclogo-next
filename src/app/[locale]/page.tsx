import { getTranslations } from 'next-intl/server'
import Hero from '@/components/Hero';
import LatestLogos from '@/components/LatestLogos'

export const revalidate = 3600

export default async function HomePage() {
  const t = await getTranslations('HomePage');
  return (
    <>
      <Hero />
      <main className="container mx-auto px-6 py-10 flex-grow flex flex-col">
        <LatestLogos />
      </main>
    </>
  )
}