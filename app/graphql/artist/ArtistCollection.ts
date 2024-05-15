import {ArtistTreatmentFragment} from './ArtistTreatment';

export const ArtistCollectionFragment = `#graphql
  ${ArtistTreatmentFragment}
  fragment ArtistCollectionFilters on Filter {
    label
    values {
      label
      input
      count
    }
  }

  fragment ArtistCollection on Collection {
    id
    title
    products(first: 20, sortKey: TITLE, filters: $filters) {
      nodes {
        ...ArtistTreatmentProduct
      }
      filters {
        ...ArtistCollectionFilters
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
