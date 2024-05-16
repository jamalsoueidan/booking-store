import {UserFragment} from '../fragments/User';

export const ArtistUser = `#graphql
  ${UserFragment}
  query ArtistUser(
    $username: String!
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    metaobject(handle: {handle: $username, type: "user"}) {
      ...User
    }
  }
` as const;
