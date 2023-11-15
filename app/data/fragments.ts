export const PRODUCT_SIMPLE = `#graphql
  fragment ProductSimple on Product {
    id
    title
    handle
    publishedAt
    images(first: 1) {
        nodes {
          url
          width
          height
        }
      }
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
        selectedOptions {
          name
          value
        }
      }
    }
  }
`;
