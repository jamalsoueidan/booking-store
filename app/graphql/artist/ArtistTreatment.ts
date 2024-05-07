export const ArtistTreatmentFragment = `#graphql
  fragment ArtistTreatmentProduct on Product {
    id
    title
    handle
  }
` as const;

export const ArtistTreatment = `#graphql
${ArtistTreatmentFragment}
  query ArtistTreatment(
    $productHandle: String!
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    product(handle: $productHandle) {
      ...ArtistTreatmentProduct
    }
  }
` as const;
