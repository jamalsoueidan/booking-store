import {LOCATION_FRAGMENT} from './Location';

export const USER_LOCATIONS_FRAGMENT = `#graphql
  ${LOCATION_FRAGMENT}
  fragment UserLocations on Metaobject {
    locations: field(key: "locations") {
      references(first: 4) {
        nodes {
          ...Location
        }
      }
    }
  }
` as const;
