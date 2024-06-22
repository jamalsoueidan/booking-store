import i18n, {type BackendModule, type ReadCallback} from 'i18next';
import {initReactI18next} from 'react-i18next';

class CustomBackend implements BackendModule {
  static type: 'backend' = 'backend' as const;
  type = 'backend' as const;

  init(services: any, backendOptions: any, i18nextOptions: any): void {
    // You can initialize any options here if needed
  }

  read(language: string, namespace: string, callback: ReadCallback): void {
    import(`../public/locales/${language}/${namespace}.json`)
      .then((resources) => {
        callback(null, resources.default);
      })
      .catch((error) => {
        callback(error, false);
      });
  }

  create?(
    languages: string[],
    namespace: string,
    key: string,
    fallbackValue: string,
  ): void {
    // Optional: Implement this if you need to support missing key handling
  }
}

export async function initI18nServer(language?: string) {
  if (i18n.isInitialized) {
    return i18n;
  }

  return i18n
    .use(CustomBackend)
    .use(initReactI18next)
    .init({
      fallbackLng: 'da',
      lng: language,
      debug: true,
      react: {
        useSuspense: false,
      },
      interpolation: {
        escapeValue: false,
      },
    });
}
