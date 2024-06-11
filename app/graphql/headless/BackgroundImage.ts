export const BACKGROUND_IMAGE_FRAGMENT = `#graphql
  fragment BackgroundImage on Metaobject {
    id
    type
    image: field(key: "image") {
      reference {
        ...Image
      }
    }
    opacity: field(key:"opacity") {
      value
    }
    style: field(key:"style") {
      value
    }
  }
` as const;
