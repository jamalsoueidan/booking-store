export const MAPS_FRAGMENT = `#graphql
  fragment Maps on Metaobject {
    id
    type
    url: field(key: "url") {
      value
    }
  }
` as const;
