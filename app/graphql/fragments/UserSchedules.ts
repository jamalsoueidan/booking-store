export const USER_SCHEDULES_FRAGMENT = `#graphql
  fragment Schedule on Metaobject {
    id
    handle
    name: field(key: "name") {
      value
    }
    slots: field(key: "slots") {
      value
    }
    locations: field(key: "locations") {
      references(first: 4) {
        nodes {
          ...on Metaobject {
            id
            handle
          }
        }
      }
    }
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
