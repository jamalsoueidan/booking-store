export const ArtistTreatmentOptionsVariantFragment = `#graphql
  fragment ArtistTreatmentOptionsVariant on ProductVariant {
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
    duration: metafield(key: "duration", namespace: "booking") {
      id
      value
    }
  }
` as const;

export const ArtistTreatmentOptionsFragment = `#graphql
  ${ArtistTreatmentOptionsVariantFragment}

  fragment ArtistTreatmentOptions on Product {
    id
    title
    handle
    options {
      name
      values
    }
    parentId: metafield(key: "parentId", namespace: "booking") {
      id
      value
    }
    variants(first: 5) {
      nodes {
        ...ArtistTreatmentOptionsVariant
      }
    }
  }
` as const;

export const ArtistTreatmentOptions = `#graphql
  ${ArtistTreatmentOptionsFragment}

  query ArtistTreatmentOptions(
    $country: CountryCode
    $language: LanguageCode
    $query: String!
  ) @inContext(country: $country, language: $language) {
    products(first: 10, query: $query) {
      nodes {
        ...ArtistTreatmentOptions
      }
    }
  }
` as const;