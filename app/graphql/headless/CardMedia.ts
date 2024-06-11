export const CARD_MEDIA_FRAGMENT = `#graphql
  fragment CardMedia on Metaobject {
    id
    type
    title: field(key: "title") {
      value
    }
    description: field(key:"description") {
      value
    }
    image: field(key: "image") {
      reference {
        ...Image
      }
    }
    flip: field(key:"flip") {
      value
    }
  }
` as const;
