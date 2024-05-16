import {UserFragment} from '../metafields/user';

export const FrontendTreatmentsFragment = `#graphql
  ${UserFragment}

  fragment FrontendTreatmentsProduct on Product {
    id
    title
    handle
    description
    featuredImage {
      height
      width
      url(transform: { maxHeight: 250, maxWidth: 250, crop: CENTER })
    }
    collection: metafield(key: "collection", namespace: "system") {
      reference {
        ... on Collection {
          products(first: 5, sortKey: RELEVANCE, filters: {productMetafield: {namespace: "booking", key: "hide_from_profile", value: "false"}}) {
            filters {
              id
              label
              values {
                count
              }
            }
            nodes {
              user: metafield(key: "user", namespace: "booking") {
                reference {
                  ...User
                }
              }
            }
          }
        }
      }
    }
  }
` as const;

export const FrontendTreatments = `#graphql
  ${FrontendTreatmentsFragment}
  query FrontendTreatments(
    $query: String!
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    products(first: 10, sortKey: RELEVANCE, query: $query) {
      nodes {
        ...FrontendTreatmentsProduct
      }
    }
  }
` as const;
