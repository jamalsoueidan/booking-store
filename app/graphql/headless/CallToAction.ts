export const CALL_TO_ACTION_FRAGMENT = `#graphql
  fragment CallToAction on Metaobject {
    id
    type
    name: field(key:"name") {
      value
    }
    title: field(key:"title") {
      value
    }
    image: field(key: "image") {
      reference {
        ...Image
      }
    }
    color: field(key: "color") {
      value
    }
    button: field(key:"button") {
      reference {
        ...Button
      }
    }
    overlay: field(key: "overlay") {
      reference {
        ...Overlay
      }
    }
  }
` as const;
