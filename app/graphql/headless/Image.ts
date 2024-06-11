export const IMAGE_FRAGMENT = `#graphql
  fragment Image on MediaImage {
    id
    image {
      url
      height
      width
    }
  }
` as const;
