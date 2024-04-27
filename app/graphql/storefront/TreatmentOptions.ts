export const TREATMENT_VARIANT = `#graphql
  fragment TreatmentVariant on ProductVariant {
    id
    title
    image {
      id
      url
      altText
      width
      height
    }
    price {
      amount
      currencyCode
    }
    compareAtPrice {
      amount
      currencyCode
    }
    selectedOptions {
      name
      value
    }
  }
` as const;

export const TREATMENT_OPTIONS_FRAGMENT = `#graphql
  fragment TreatmentOptions on Product {
    id
    title
    handle
    options {
      name
      values
    }
    variants(first: 5) {
      nodes {
        ...TreatmentVariant
      }
    }
  }
  ${TREATMENT_VARIANT}
` as const;

export const TREATMENT_OPTIONS_QUERY = `#graphql
  ${TREATMENT_OPTIONS_FRAGMENT}
  query GetTreatmentOptions(
    $country: CountryCode
    $language: LanguageCode
    $query: String!
  ) @inContext(country: $country, language: $language) {
    products(first: 10, query: $query) {
      nodes {
        ...TreatmentOptions
      }
    }
  }
` as const;
