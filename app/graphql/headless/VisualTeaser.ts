export const VISUAL_TEASER_FRAGMENT = `#graphql
  fragment VisualTeaser on Metaobject {
    id
    type
    title: field(key: "title") {
      value
    }
    subtitle: field(key: "subtitle") {
      value
    }
    height:field(key:"height") {
      value
    }
    backgroundColor:field(key:"background_color") {
      value
    }
    fontColor: field(key:"font_color") {
      value
    }
    justify: field(key:"justify") {
      value
    }
    backgroundImage: field(key:"background_image") {
      reference {
        ...BackgroundImage
      }
    }
    subbutton: field(key:"subbutton") {
      reference {
        ...Button
      }
    }
  }
` as const;
