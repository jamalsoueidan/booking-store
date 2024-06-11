export const IMAGE_GRID_WITH_HEADER_COLLECTION_FRAGMENT = `#graphql
  fragment ImageGridWithHeaderCollection on Collection {
    id
    title
    handle
    image {
      height
      width
      url(transform: {maxHeight: 150, maxWidth: 150, crop: CENTER})
    }
  }
` as const;

export const IMAGE_GRID_WITH_HEADER_FRAGMENT = `#graphql
  ${IMAGE_GRID_WITH_HEADER_COLLECTION_FRAGMENT}
  fragment ImageGridWithHeader on Metaobject {
    id
    type
    title: field(key: "title") {
      value
    }
    backgroundColor:field(key:"background_color") {
      value
    }
    collections: field(key:"collections") {
      references(first: 5) {
        nodes {
          ...ImageGridWithHeaderCollection
        }
      }
    }
  }
` as const;
