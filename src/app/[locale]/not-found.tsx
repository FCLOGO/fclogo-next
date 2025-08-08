import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Home } from 'lucide-react';

export default function NotFoundPage() {
  const t = useTranslations('NotFoundPage');

  return (
    <main className="container mx-auto px-6 py-10 flex-grow flex flex-col items-center justify-center">
      <div className="text-center">
        <h1 className="text-9xl font-mono font-bold text-primary opacity-10">404</h1>
        <p className="text-2xl md:text-3xl font-bold tracking-tight text-base-content/80 mt-4">
          {t('title')}
        </p>
        <p className="mt-4 text-base-content/60">
          {t('description')}
        </p>
        
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Link
            href="/"
            className="btn btn-primary btn-lg rounded"
          >
            <Home className="w-5 h-5 mr-2" />
            {t('goHome')}
          </Link>
        </div>
      </div>
    </main>
  );
}