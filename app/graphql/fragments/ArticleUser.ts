import {ARTICLE_USER_PRODUCT} from './ArticleUserProducts';
import {USER_FRAGMENT} from './User';
import {USER_COLLECTION_FILTER} from './UserCollectionFilter';

export const ARTICLE_USER_FRAGMENT = `#graphql
  ${USER_FRAGMENT}
  ${USER_COLLECTION_FILTER}
  ${ARTICLE_USER_PRODUCT}

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
          products(first: 3, sortKey: RELEVANCE, filters: [{productMetafield: {namespace: "booking", key: "hide_from_profile", value: "false"}}, {productMetafield: {namespace: "system", key: "active",value: "true"}}]) {
            nodes {
              ...ArticleUserProduct
            }
            filters {
              ...UserCollectionFilter
            }
          }
        }
      }
    }
  }
` as const;
