import {USER_FRAGMENT} from './User';
import {USER_COLLECTION_FILTER} from './UserCollectionFilter';

export const ARTICLE_USER_FRAGMENT = `#graphql
  ${USER_FRAGMENT}
  ${USER_COLLECTION_FILTER}
  fragment ArticleUser on Article {
    title
    tags
    id
    user: metafield(key: "user", namespace: "booking") {
      reference {
        ...User
      }
    }
    collection: metafield(key: "collection", namespace: "booking") {
      reference {
        ... on Collection {
          products(first: 1) {
            filters {
             ...UserCollectionFilter
            }
          }
        }
      }
    }
  }
` as const;
