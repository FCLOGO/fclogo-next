import { getTranslations } from 'next-intl/server'
import Hero from '@/components/Hero';

export const revalidate = 3600

export default async function HomePage() {
  const t = await getTranslations('HomePage');
  return (
      <Hero />
  )
}