import {TREATMENT_PRODUCT} from './TreatmentProduct';
import {USER_COLLECTION_FILTER} from './UserCollectionFilter';

export const USER_COLLECTION_WITH_PRODUCTS = `#graphql
  ${TREATMENT_PRODUCT}
  ${USER_COLLECTION_FILTER}

  fragment UserCollectionWithProducts on Collection {
    id
    title
    products(first: 20, sortKey: TITLE, filters: $filters) {
      nodes {
        ...TreatmentProduct
      }
      filters {
        ...UserCollectionFilter
      }
    }
  }
` as const;
