export const CategoriesFragment = `#graphql
  fragment CategoriesCollection on Collection {
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
    icon:  metafield(namespace:"custom",  key: "icon") {
      type
      value
    }
    color:  metafield(namespace:"custom",  key: "color") {
      type
      value
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
            icon:  metafield(namespace:"custom",  key: "icon") {
              type
              value
            }
            color:  metafield(namespace:"custom",  key: "color") {
              type
              value
            }
          }
        }
      }
    }
  }
` as const;

export const Categories = `#graphql
  ${CategoriesFragment}
  query CategoriesCollection(
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    collection(handle: "alle-behandlinger") {
      ...CategoriesCollection
    }
  }
` as const;
