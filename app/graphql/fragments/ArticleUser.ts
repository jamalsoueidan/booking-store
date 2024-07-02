import {TREATMENT_PRODUCT} from './TreatmentProduct';
import {USER_FRAGMENT} from './User';
import {USER_COLLECTION_FILTER} from './UserCollectionFilter';

export const ARTICLE_USER_FRAGMENT = `#graphql
  ${USER_FRAGMENT}
  ${USER_COLLECTION_FILTER}
  ${TREATMENT_PRODUCT}

  fragment ArticleUser on Article {
    id
    title
    tags
    user: metafield(key: "user", namespace: "booking") {
      reference {
        ...User
      }
    }
    collection: metafield(key: "collection", namespace: "booking") {
      reference {
        ... on Collection {
          products(first: 2, sortKey: RELEVANCE, filters: [{productMetafield: {namespace: "booking", key: "hide_from_profile", value: "false"}}, {productMetafield: {namespace: "system", key: "active",value: "true"}}]) {
            nodes {
              ...TreatmentProduct
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
