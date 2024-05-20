import {USER_COLLECTION_WITH_PRODUCTS} from '../fragments/UserCollectionWithProducts';

export const GET_USER_PRODUCTS = `#graphql
  ${USER_COLLECTION_WITH_PRODUCTS}

  query GetUserProducts(
    $handle: String!
    $country: CountryCode
    $language: LanguageCode
    $filters: [ProductFilter!] = {}
  ) @inContext(country: $country, language: $language) {
    collection(handle: $handle) {
      ...UserCollectionWithProducts
    }
  }
` as const;
