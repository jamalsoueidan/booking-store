import {TREATMENT_PRODUCT} from './TreatmentProduct';

export const USER_COLLECTION_WITH_PRODUCTS = `#graphql
  ${TREATMENT_PRODUCT}

  fragment UserCollectionProductsFilters on Filter {
    id
    label
    values {
      label
      input
      count
    }
  }

  fragment UserCollectionWithProducts on Collection {
    id
    title
    products(first: 20, sortKey: TITLE, filters: $filters) {
      nodes {
        ...TreatmentProduct
      }
      filters {
        ...UserCollectionProductsFilters
      }
    }
  }
` as const;
