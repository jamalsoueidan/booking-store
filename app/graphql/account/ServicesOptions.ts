export const SERVICES_OPTIONS_TAG_FRAGMENT = `#graphql
  fragment MoneyProductItem on MoneyV2 {
    amount
    currencyCode
  }

  fragment ServicesOptionsTagProduct on Product {
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
        title
        price {
          ...MoneyProductItem
        }
      }
    }
  }
` as const;

export const ServicesOptionsTagOptions = `#graphql
  ${SERVICES_OPTIONS_TAG_FRAGMENT}
  query ServicesOptionsTagOptionsQuery(
    $country: CountryCode
    $language: LanguageCode
    $query: String!
    $first: Int
  ) @inContext(country: $country, language: $language) {
    products(first: $first, query: $query) {
      nodes {
        ...ServicesOptionsTagProduct
      }
    }
  }
` as const;
