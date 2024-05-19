export const LOCATION_FRAGMENT = `#graphql
  fragment Location on Metaobject {
    id
    handle
    fields {
      value
      key
    }
  }
` as const;
