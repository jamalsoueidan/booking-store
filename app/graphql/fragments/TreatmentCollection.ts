import {TREATMENT_USER_FRAGMENT} from '../fragments/TreatmentUser';

export const TREATMENT_COLLECTION_FRAGMENT = `#graphql
  ${TREATMENT_USER_FRAGMENT}

  fragment TreatmentCollection on Product {
    id
    title
    descriptionHtml
    description
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
    collection: metafield(key: "collection", namespace: "system") {
      reference {
        ... on Collection {
          products(first: 5, sortKey: RELEVANCE, filters: [{productMetafield: {namespace: "booking", key: "hide_from_profile", value: "false"}}, {productMetafield: {namespace: "system", key: "active",value: "true"}}]) {
            filters {
              id
              label
              values {
                count
              }
            }
            nodes {
              ...TreatmentUser
            }
          }
        }
      }
    }
  }
` as const;
