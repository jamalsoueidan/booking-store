export const SIDE_BY_SIDE_FRAGMENT = `#graphql
  fragment SideBySide on Metaobject {
    id
    type
    title: field(key:"title") {
      value
    }
    text: field(key: "text") {
      value
    }
  }
` as const;
