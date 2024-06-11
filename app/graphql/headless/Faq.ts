export const FAQ_FRAGMENT = `#graphql
  fragment Faq on Metaobject {
    id
    type
    title: field(key: "title") {
      value
    }
    description:field(key:"description") {
      value
    }
    backgroundColor:field(key:"background_color") {
      value
    }
    direction: field(key:"direction") {
      value
    }
    accordion: field(key: "accordion") {
      reference {
        ...Accordion
      }
    }
  }
` as const;
