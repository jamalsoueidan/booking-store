export const USER_COLLECTION_FILTER = `#graphql
  fragment UserCollectionFilter on Filter {
    label
    values {
      label
      input
      count
    }
  }
` as const;
