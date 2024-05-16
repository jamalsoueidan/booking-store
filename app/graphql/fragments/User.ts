export const UserFragment = `#graphql
  fragment User on Metaobject {
    id #for key={id}
    fields {
      value
      key
      reference {
        ... on MediaImage {
          image {
            width
            height
            url(transform: {})
          }
        }
      }
    }
  }
` as const;
