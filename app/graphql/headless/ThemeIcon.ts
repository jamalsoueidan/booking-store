export const THEME_ICON_FRAGMENT = `#graphql
  fragment ThemeIcon on Metaobject {
    id
    type
    name: field(key: "name") {
      value
    }
    icon: field(key: "icon") {
      value
    }
    variant: field(key: "variant") {
      value
    }
    color: field(key: "color") {
      value
    }
    radius: field(key: "radius") {
      value
    }
  }
` as const;
