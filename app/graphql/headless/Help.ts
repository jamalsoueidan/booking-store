import {THEME_ICON_FRAGMENT} from './ThemeIcon';

export const HELP_ITEM_FRAGMENT = `#graphql
  ${THEME_ICON_FRAGMENT}

  fragment HelpItem on Metaobject {
    id
    type
    title: field(key: "title") {
      value
    }
    description: field(key: "description") {
      value
    }
    themeIcon: field(key: "theme_icon") {
      reference {
        ...ThemeIcon
      }
    }
    backgroundColor: field(key: "background_color") {
      value
    }
  }
` as const;

export const HELP_FRAGMENT = `#graphql
  ${HELP_ITEM_FRAGMENT}

  fragment Help on Metaobject {
    id
    type
    name: field(key: "name") {
      value
    }
    title: field(key: "title") {
      value
    }
    items: field(key: "items") {
      references(first: 10) {
        nodes {
          ...HelpItem
        }
      }
    }
    backgroundColor: field(key: "background_color") {
      value
    }
  }
` as const;
