export const BUTTON_FRAGMENT = `#graphql
  fragment Button on Metaobject {
    id
    type
    text: field(key: "text") {
      value
    }
    linkTo: field(key:"link_to") {
      value
    }
    variant: field(key:"variant") {
      value
    }
    color: field(key:"color") {
      value
    }
  }
` as const;
