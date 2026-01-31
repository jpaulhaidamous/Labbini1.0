import { getRequestConfig } from 'next-intl/server';

export const locales = ['en', 'ar'] as const;

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = requested ?? 'en';
  const finalLocale = (locales as readonly string[]).includes(locale)
    ? (locale as 'en' | 'ar')
    : 'en';

  try {
    const messages = (await import(`./messages/${finalLocale}.json`)).default;
    return { locale: finalLocale, messages };
  } catch {
    const messages = (await import('./messages/en.json')).default;
    return { locale: 'en', messages };
  }
});
