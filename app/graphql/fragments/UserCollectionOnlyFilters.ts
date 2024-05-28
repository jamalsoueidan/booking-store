import {USER_COLLECTION_FILTER} from './UserCollectionFilter';

export const USER_COLLECTION_ONLY_FILTERS = `#graphql
  ${USER_COLLECTION_FILTER}
  fragment UserCollectionOnlyFilters on Collection {
    products(first: 1) {
      filters {
        ...UserCollectionFilter
      }
    }
  }
` as const;
