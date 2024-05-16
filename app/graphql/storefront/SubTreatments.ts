import {UserFragment} from '../metafields/user';

export const SubTreatmentsFragment = `#graphql
  ${UserFragment}

  fragment SubTreatmentsProduct on Product {
    id
    handle
    user: metafield(key: "user", namespace: "booking") {
      reference {
        ...User
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
    products(first: 10, sortKey: TITLE, query: $query) {
      nodes {
        ...SubTreatmentsProduct
      }
    }
  }
` as const;
