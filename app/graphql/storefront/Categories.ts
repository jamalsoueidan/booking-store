export const CATEGORIES_FRAGMENT = `#graphql
  fragment Category on Collection {
    id
    title
    handle
    description
    image {
      id
      url
      altText
      width
      height
    }
    children: metafield(key: "children", namespace: "booking") {
      id
      type
      references(first: 20) {
        nodes {
          ... on Collection {
            id
            title
            handle
            description
            image {
              id
              url
              altText
              width
              height
            }
          }
        }
      }
    }
  }
` as const;

export const CATEGORIES = `#graphql
  ${CATEGORIES_FRAGMENT}
  query Categories(
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    collection(handle: "alle-behandlinger") {
      ...Category
    }
  }
` as const;
