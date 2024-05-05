export const PRODUCT_TAG_OPTIONS_FRAGMENT = `#graphql
  fragment MoneyProductItem on MoneyV2 {
    amount
    currencyCode
  }

  fragment ProductTagOptions on Product {
    id
    handle
    title
    options {
      name
      values
    }
    variants(first: 5) {
      nodes {
        id
        price {
          ...MoneyProductItem
        }
        title
      }
    }
  }
` as const;

export const PRODUCT_TAG_OPTIONS_QUERY = `#graphql
  ${PRODUCT_TAG_OPTIONS_FRAGMENT}
  query SearchForProductByTags(
    $country: CountryCode
    $language: LanguageCode
    $query: String!
  ) @inContext(country: $country, language: $language) {
    products(first: 10, query: $query) {
      nodes {
        ...ProductTagOptions
      }
    }
  }
` as const;
