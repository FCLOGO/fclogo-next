import type { InternationalizedString } from '@/types';

export function localize(
  field: InternationalizedString | undefined, 
  locale: string, 
  fallbackLocale: string = 'en'
): string {
  if (!field || !Array.isArray(field)) {
    return '';
  }
  const translation = field.find(item => item._key === locale);
  const fallback = field.find(item => item._key === fallbackLocale);
  return translation?.value || fallback?.value || '';
}