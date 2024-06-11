export const TRANSLATIONS_FRAGMENT = `#graphql
  fragment Translations on Metaobject {
    key: field(key: "key") {
      value
    }
    value: field(key: "value") {
      value
    }
  }
` as const;
