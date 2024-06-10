import {USER_LOCATIONS_FRAGMENT} from './UserLocations';

export const USER_SCHEDULES_FRAGMENT = `#graphql
  ${USER_LOCATIONS_FRAGMENT}

  fragment Schedule on Metaobject {
    id
    handle
    name: field(key: "name") {
      value
    }
    slots: field(key: "slots") {
      value
    }
    ...UserLocations
  }

  fragment UserSchedules on Metaobject {
    schedules: field(key: "schedules") {
      references(first: 4) {
        nodes {
          ...Schedule
        }
      }
    }
  }
` as const;
