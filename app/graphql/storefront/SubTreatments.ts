export const SubTreatmentsFragment = `#graphql
  fragment SubTreatmentsProduct on Product {
    id
    handle
    user: metafield(key: "user", namespace: "booking") {
      reference {
        ... on Metaobject {
          fields {
            key
            value
            reference {
              ... on MediaImage {
                image {
                  width
                  height
                  url(transform: {})
                }
              }
            }
          }
        }
      }
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
  }
` as const;

export const SubTreatments = `#graphql
${SubTreatmentsFragment}
  query SubTreatment(
    $query: String!
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    products(first: 10, query: $query) {
      nodes {
        ...SubTreatmentsProduct
      }
    }
  }
` as const;
