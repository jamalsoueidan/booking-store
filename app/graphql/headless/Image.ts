export const IMAGE_FRAGMENT = `#graphql
  fragment Image on MediaImage {
    id
    image {
      url(transform: { maxHeight: 500, maxWidth: 500, crop: CENTER })
      height
      width
    }
  }
` as const;
