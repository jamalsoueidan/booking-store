import i18n, {type InitOptions} from 'i18next';
import HttpApi from 'i18next-http-backend';
import {initReactI18next} from 'react-i18next';
import da from '~/assets/locales/da/translation.json';
import en from '~/assets/locales/en/translation.json';

const supportedLanguages = ['da', 'en'];
const defaultLanguage = 'da';
const isBrowser = typeof window === 'object' && typeof document === 'object';

//https://sergiodxa.com/articles/localizing-remix-apps-with-i18next

export async function initI18Next(i18next: typeof i18n, language?: string) {
  const lng = language ?? defaultLanguage;
  const options: InitOptions = {
    fallbackLng: defaultLanguage,
    supportedLngs: supportedLanguages,
    keySeparator: false,
    load: 'languageOnly',
    cleanCode: true,
    initImmediate: true,
    interpolation: {escapeValue: false},
    react: {useSuspense: false},
  };

  if (!isBrowser) {
    options.lng = lng;
    options.defaultNS = 'namespace1';
  } else {
    options.backend = {loadPath: '/locales/{{lng}}.json'};
    i18next.use(HttpApi);
  }

  await i18next.use(initReactI18next).init(options);

  if (!isBrowser) {
    // if we are running server-side we will require the localized message from the public/locales folder
    // and add it as a resource bundle to i18next so it has the localized message already loaded
    i18n.addResourceBundle(lng, 'namespace1', {
      da: {common: da},
      en: {common: en},
    });
  }
}
