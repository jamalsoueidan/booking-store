import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import {z} from 'zod';
import {makeZodI18nMap} from 'zod-i18n-map';
import {i18nDefaultConfig} from './defaultConfig';

export async function initI18nServer(
  language: string,
  namespaces: string[] = [],
) {
  if (i18n.isInitialized) {
    return i18n;
  }

  const resources: Record<string, any> = {};

  await Promise.all(
    namespaces.map(async (namespace) => {
      const content = await import(
        `../../public/locales/${language}/${namespace}.json`
      );
      resources[namespace] = content.default;
    }),
  );

  return i18n
    .use(initReactI18next)
    .init({
      ...i18nDefaultConfig,
      fallbackLng: language,
      lng: language,
      ns: namespaces,
      resources: {
        [language]: resources,
      },
    })
    .then(() => {
      z.setErrorMap(makeZodI18nMap());
    });
}
