import {USER_FRAGMENT} from '../fragments/User';

export const ArtistUser = `#graphql
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
