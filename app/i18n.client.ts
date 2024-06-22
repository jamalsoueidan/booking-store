import i18n from 'i18next';
import backend from 'i18next-http-backend';
import {initReactI18next} from 'react-i18next';

export async function initI18nClient() {
  if (i18n.isInitialized) {
    return i18n;
  }

  const language = getLanguageFromSubdomain();
  return i18n
    .use(initReactI18next)
    .use(backend)
    .init({
      lng: language,
      fallbackLng: 'en',
      debug: true,
      react: {
        useSuspense: false,
      },
      backend: {
        loadPath: '/locales/{{lng}}/{{ns}}.json',
      },
    });
}

export function getLanguageFromSubdomain() {
  const hostname = window.location.hostname;
  const subdomain = hostname.split('.')[0];

  switch (subdomain) {
    case 'en':
      return 'en';
    case 'ar':
      return 'ar';
    default:
      return 'da'; // Default to Danish if no specific subdomain is present
  }
}
