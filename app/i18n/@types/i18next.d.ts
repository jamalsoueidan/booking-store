import Resources from './resources';

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'translation';
    resources: Resources;
  }
}

export type Namespace = keyof Resources;

declare global {
  interface Handle {
    i18n?: Namespace[];
  }
}
