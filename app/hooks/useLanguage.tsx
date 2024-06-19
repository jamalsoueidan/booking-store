import {type LanguageCode} from '@shopify/hydrogen/storefront-api-types';
import {useEffect, useState} from 'react';

export const useLanguage = () => {
  const [defaultLocale, setDefaultLocale] = useState<LanguageCode>('DA');

  useEffect(() => {
    const hostname = window.location.hostname;
    const subdomain = hostname.split('.')[0]?.toUpperCase();
    const supportedLocales = {
      EN: {language: 'EN', country: 'DK'},
      DK: {language: 'DA', country: 'DK'},
      AR: {language: 'AR', country: 'DK'},
    } as Record<string, I18nLocale>;

    setDefaultLocale(supportedLocales[subdomain]?.language || defaultLocale);
  }, [defaultLocale]);

  return defaultLocale;
};
