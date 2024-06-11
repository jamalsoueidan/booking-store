export const OVERLAY_FRAGMENT = `#graphql
  fragment Overlay on Metaobject {
    id
    type
    color: field(key: "color") {
      value
    }
    opacity: field(key:"opacity") {
      value
      type
    }
  }
` as const;
