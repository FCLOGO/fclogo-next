import Hero from '@/components/Hero';
import LatestLogos from '@/components/LatestLogos'
import LatestPacks from '@/components/LatestPacks';

export const revalidate = 3600

export default async function HomePage() {
  return (
    <>
      <Hero />
      <main className="container mx-auto px-6 py-10 flex-grow flex flex-col">
        <LatestLogos />
        <LatestPacks />
      </main>
    </>
  )
}