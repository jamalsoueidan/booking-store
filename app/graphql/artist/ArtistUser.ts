export const ArtistUserFragment = `#graphql
  fragment ArtistUser on Metaobject {
    fields {
      value
      key
      reference {
        ... on MediaImage {
          image {
            width
            height
            url(transform: {})
          }
        }
      }
    }
  }
` as const;

export const ArtistUser = `#graphql
  ${ArtistUserFragment}
  query ArtistUser(
    $username: String!
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    metaobject(handle: {handle: $username, type: "user"}) {
      ...ArtistUser
    }
  }
` as const;
