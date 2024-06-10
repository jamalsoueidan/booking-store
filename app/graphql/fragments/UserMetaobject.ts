import {USER_FRAGMENT} from './User';
import {USER_SCHEDULES_FRAGMENT} from './UserSchedules';

export const USER_METAOBJECT_QUERY = `#graphql
  ${USER_FRAGMENT}
  ${USER_SCHEDULES_FRAGMENT}
  query ArtistUser(
    $username: String!
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    metaobject(handle: {handle: $username, type: "user"}) {
      ...User
      ...UserSchedules
    }
  }
` as const;
