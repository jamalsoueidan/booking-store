export const ArtistTreatmentIndexVariantFragment = `#graphql
  fragment ArtistTreatmentIndexVariant on ProductVariant {
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

export const ArtistTreatmentIndexFragment = `#graphql
  ${ArtistTreatmentIndexVariantFragment}

  fragment ArtistTreatmentIndexProduct on Product {
    id
    title
    handle
    options {
      name
      values
    }
    variants(first: 5) {
      nodes {
        ...ArtistTreatmentIndexVariant
      }
    }
  }
` as const;

export const ArtistTreatmentIndex = `#graphql
  ${ArtistTreatmentIndexFragment}

  query ArtistTreatmentIndex(
    $country: CountryCode
    $language: LanguageCode
    $query: String!
  ) @inContext(country: $country, language: $language) {
    products(first: 10, query: $query) {
      nodes {
        ...ArtistTreatmentIndexProduct
      }
    }
  }
` as const;
