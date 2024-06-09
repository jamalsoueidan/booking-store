export const USER_COLLECTION_FILTER = `#graphql
  fragment UserCollectionFilter on Filter {
    id
    label
    values {
      label
      input
      count
    }
  }
` as const;
