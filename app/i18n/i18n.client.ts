import i18n from 'i18next';
import backend from 'i18next-http-backend';
import {initReactI18next} from 'react-i18next';
import {i18nDefaultConfig} from './defaultConfig';
import {extractNamespaces} from './extractNamespaces';

export async function initI18nClient() {
  if (i18n.isInitialized) {
    return i18n;
  }

  const language = getLanguageFromSubdomain();
  const namespaces = extractNamespaces(window.__remixRouteModules);

  return i18n
    .use(initReactI18next)
    .use(backend)
    .init({
      ...i18nDefaultConfig,
      lng: language,
      ns: namespaces,
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
