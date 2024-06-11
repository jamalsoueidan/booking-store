export const FEATURE_ITEM_FRAGMENT = `#graphql
  fragment FeatureItem on Metaobject {
    id
    type
    title: field(key: "title") {
      value
    }
    description: field(key: "description") {
      value
    }
    icon: field(key: "icon") {
      value
    }
  }
` as const;

export const FEATURES_FRAGMENT = `#graphql
  ${FEATURE_ITEM_FRAGMENT}

  fragment Features on Metaobject {
    id
    type
    title: field(key: "title") {
      value
    }
    subtitle: field(key: "subtitle") {
      value
    }
    items: field(key: "items") {
      references(first: 10) {
        nodes {
          ...FeatureItem
        }
      }
    }
  }
` as const;
