import {USER_FRAGMENT} from './User';

export const USER_METAOBJECT_QUERY = `#graphql
  ${USER_FRAGMENT}
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
