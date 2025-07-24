export function localize(field: any, locale: string, fallbackLocale: string = 'en') {
  if (!Array.isArray(field)) {
    return field;
  }
  const translation = field.find(item => item._key === locale);
  const fallback = field.find(item => item._key === fallbackLocale);
  return translation?.value || fallback?.value || '';
}