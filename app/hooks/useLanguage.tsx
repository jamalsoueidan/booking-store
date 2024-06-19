import {type LanguageCode} from '@shopify/hydrogen/storefront-api-types';
import {useEffect, useState} from 'react';
import {supportedLocales} from 'server';

export const useLanguage = () => {
  const [defaultLocale, setDefaultLocale] = useState<LanguageCode>('DA');

  useEffect(() => {
    const hostname = window.location.hostname;
    const subdomain = hostname.split('.')[0]?.toUpperCase();
    setDefaultLocale(supportedLocales[subdomain].language || defaultLocale);
  }, [defaultLocale]);

  return defaultLocale;
};
