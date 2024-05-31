import {USER_FRAGMENT} from './User';
import {USER_LOCATIONS_FRAGMENT} from './UserLocations';
import {USER_SCHEDULES_FRAGMENT} from './UserSchedules';

export const USER_METAOBJECT_QUERY = `#graphql
  ${USER_FRAGMENT}
  ${USER_SCHEDULES_FRAGMENT}
  ${USER_LOCATIONS_FRAGMENT}
  query ArtistUser(
    $username: String!
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    metaobject(handle: {handle: $username, type: "user"}) {
      ...User
      ...UserSchedules
      ...UserLocations
    }
  }
` as const;
