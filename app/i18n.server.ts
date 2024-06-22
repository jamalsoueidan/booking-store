import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import da from '~/assets/locales/da/translation.json';
import en from '~/assets/locales/en/translation.json';

export async function initI18nServer(language?: string) {
  if (i18n.isInitialized) {
    return i18n;
  }

  return i18n.use(initReactI18next).init({
    lng: language,
    debug: true,
    resources: {
      en,
      da,
    },
  });
}
