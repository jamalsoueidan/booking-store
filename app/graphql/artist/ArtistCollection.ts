import {ArtistTreatmentFragment} from './ArtistTreatment';

export const ArtistCollectionFragment = `#graphql
  ${ArtistTreatmentFragment}
  fragment ArtistCollection on Collection {
    id
    title
    products(first: 10, filters: $filters) {
      nodes {
        ...ArtistTreatmentProduct
      }
    }
  }
` as const;

export const ArtistCollection = `#graphql
${ArtistCollectionFragment}
  query ArtistCollection(
    $handle: String!
    $country: CountryCode
    $language: LanguageCode
    $filters: [ProductFilter!] = {}
  ) @inContext(country: $country, language: $language) {
    collection(handle: $handle) {
      ...ArtistCollection
    }
  }
` as const;
