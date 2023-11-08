export const PRODUCT_SIMPLE = `#graphql
  fragment ProductSimple on Product {
    id
    title
    handle
    publishedAt
    variants(first: 10) {
      nodes {
        id
        image {
          url
          altText
          width
          height
        }
        price {
          amount
          currencyCode
        }
      }
    }
  }
`;
