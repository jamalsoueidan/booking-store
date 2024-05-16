import {USER_FRAGMENT} from './User';

export const TREATMENT_USER_FRAGMENT = `#graphql
  ${USER_FRAGMENT}

  fragment TreatmentUser on Product {
    id
    title
    descriptionHtml
    productType
    handle
    vendor
    featuredImage {
      id
      altText
      url(transform: { maxHeight: 500, maxWidth: 500, crop: CENTER })
      width
      height
    }
    variants(first: 1) {
      nodes {
        id
        compareAtPrice {
          amount
          currencyCode
        }
        price {
          amount
          currencyCode
        }
      }
    }
    user: metafield(key: "user", namespace: "booking") {
      reference {
        ...User
      }
    }
  }
` as const;
