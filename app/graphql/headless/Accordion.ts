export const ACCORDION_ITEM_FRAGMENT = `#graphql
  fragment AccordionItem on Metaobject {
    id
    type
    label: field(key: "label") {
      value
    }
    text: field(key:"text") {
      value
    }
  }
` as const;

export const ACCORDION_FRAGMENT = `#graphql
  ${ACCORDION_ITEM_FRAGMENT}
  fragment Accordion on Metaobject {
    id
    type
    name: field(key: "name") {
      value
    }
    variant: field(key:"variant") {
      key
      value
    }
    items: field(key:"items") {
      references(first: 10) {
        nodes {
          ...AccordionItem
        }
      }
    }
  }
` as const;
