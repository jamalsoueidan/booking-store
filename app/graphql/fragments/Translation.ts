export const TRANSLATIONS_FRAGMENT = `#graphql
  fragment Translations on Metaobject {
    handle
    value: field(key: "value") {
      value
    }
  }
` as const;
