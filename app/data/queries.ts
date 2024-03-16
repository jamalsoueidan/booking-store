import {
  PRODUCT_ITEM_FRAGMENT,
  PRODUCT_SELECTED_OPTIONS_FRAGMENT,
  PRODUCT_VALIDATE_HANDLER_FRAGMENT,
  PRODUCT_VARIANTS_FRAGMENT,
} from './fragments';

export const PRODUCT_QUERY_ID = `#graphql
  ${PRODUCT_ITEM_FRAGMENT}
  query ProductItemById(
    $country: CountryCode
    $language: LanguageCode
    $Id: ID!
  ) @inContext(country: $country, language: $language) {
    product(id: $Id) {
      ...ProductItem
    }
  }
` as const;

export const PRODUCT_QUERY = `#graphql
  ${PRODUCT_ITEM_FRAGMENT}
  query ProductItem(
    $country: CountryCode
    $language: LanguageCode
    $handle: String!
  ) @inContext(country: $country, language: $language) {
    product(handle: $handle) {
      ...ProductItem
    }
  }
` as const;

export const VARIANTS_QUERY = `#graphql
  ${PRODUCT_VARIANTS_FRAGMENT}
  query ProductVariants(
    $country: CountryCode
    $language: LanguageCode
    $handle: String!
  ) @inContext(country: $country, language: $language) {
    product(handle: $handle) {
      ...ProductVariants
    }
  }
` as const;

export const VARIANTS_QUERY_ID = `#graphql
  ${PRODUCT_VARIANTS_FRAGMENT}
  query ProductVariantsById(
    $country: CountryCode
    $language: LanguageCode
    $handle: ID!
  ) @inContext(country: $country, language: $language) {
    product(id: $handle) {
      ...ProductVariants
    }
  }
` as const;

export const PRODUCT_SELECTED_OPTIONS_QUERY_ID = `#graphql
${PRODUCT_SELECTED_OPTIONS_FRAGMENT}
  query ProductId(
    $country: CountryCode
    $Id: ID!
    $language: LanguageCode
    $selectedOptions: [SelectedOptionInput!]!
  ) @inContext(country: $country, language: $language) {
    product(id: $Id) {
      ...Product
    }
  }
` as const;

export const PRODUCT_SELECTED_OPTIONS_QUERY = `#graphql
${PRODUCT_SELECTED_OPTIONS_FRAGMENT}
  query Product(
    $country: CountryCode
    $productHandle: String!
    $language: LanguageCode
    $selectedOptions: [SelectedOptionInput!]!
  ) @inContext(country: $country, language: $language) {
    product(handle: $productHandle) {
      ...Product
    }
  }
` as const;

export const PRODUCT_VALIDATE_HANDLER_QUERY = `#graphql
${PRODUCT_VALIDATE_HANDLER_FRAGMENT}
  query ProductValidateHandler(
    $country: CountryCode
    $productHandle: String!
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    product(handle: $productHandle) {
      ...Product
    }
  }
` as const;
