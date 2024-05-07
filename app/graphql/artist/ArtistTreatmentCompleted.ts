export const ArtistTreatmentCompletedFragment = `#graphql
  fragment ArtistTreatmentCompletedProduct on Product {
    id
    title
    description
    variants(first: 5) {
      nodes {
        id
        title
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

export const ArtistTreatmentCompletedQuery = `#graphql
  ${ArtistTreatmentCompletedFragment}
  query ArtistTreatmentCompleted(
    $country: CountryCode
    $language: LanguageCode
    $first: Int
    $query: String
  ) @inContext(country: $country, language: $language) {
    products(first: $first, sortKey: TITLE, query: $query) {
      nodes {
        ...ArtistTreatmentCompletedProduct
      }
    }
  }
` as const;
