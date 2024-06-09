export const ARTICLE_USER_PRODUCT = `#graphql
  fragment ArticleUserProduct on Product {
    id
    title
    featuredImage {
      id
      altText
      url(transform: { maxHeight: 250, maxWidth: 250, crop: CENTER })
      width
      height
    }
  }
` as const;
