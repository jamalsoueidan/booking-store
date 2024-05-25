export const CATEGORIES_WITH_CHILDREN_FRAGMENT = `#graphql
  fragment CategoryWithChildren on Collection {
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
  ${CATEGORIES_WITH_CHILDREN_FRAGMENT}
  query CategoriesWithChildren(
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    collection(handle: "alle-behandlinger") {
      ...CategoryWithChildren
    }
  }
` as const;
