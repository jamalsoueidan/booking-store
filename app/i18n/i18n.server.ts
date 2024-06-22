import i18n, {type BackendModule, type ReadCallback} from 'i18next';
import {initReactI18next} from 'react-i18next';
import {i18nDefaultConfig} from './defaultConfig';
class CustomBackend implements BackendModule {
  static type: 'backend' = 'backend' as const;
  type = 'backend' as const;

  init(services: any, backendOptions: any, i18nextOptions: any): void {}

  read(language: string, namespace: string, callback: ReadCallback): void {
    import(`../../public/locales/${language}/${namespace}.json`)
      .then((resources) => {
        callback(null, resources.default);
      })
      .catch((error) => {
        callback(error, false);
      });
  }
}

export async function initI18nServer(
  language?: string,
  namespaces: string[] = [],
) {
  if (i18n.isInitialized) {
    return i18n;
  }

  return i18n
    .use(CustomBackend)
    .use(initReactI18next)
    .init({
      ...i18nDefaultConfig,
      lng: language,
      ns: namespaces,
    });
}
