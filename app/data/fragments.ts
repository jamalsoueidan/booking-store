export const COLLECTION_ITEM_FRAGMENT = `#graphql
  fragment Collection on Collection {
    id
    title
    handle
    description
    image {
      id
      url
      altText
      width
      height
    }
    icon:  metafield(namespace:"custom",  key: "icon") {
      type
      value
    }
    color:  metafield(namespace:"custom",  key: "color") {
      type
      value
    }
  }
` as const;

export const PRODUCT_COLLECTION_FRAGMENT = `#graphql
  fragment ProductCollection on Collection {
    title
    handle
    icon:  metafield(namespace:"custom",  key: "icon") {
      type
      value
    }
  }
` as const;

export const PRODUCT_SIMPLE_FRAGMENT = `#graphql
  fragment ProductSimple on Product {
    id
    title
    description
    handle
    publishedAt
    featuredImage {
      id
      altText
      url
      width
      height
    }
  }
` as const;

export const PRODUCT_ITEM_FRAGMENT = `#graphql
  ${PRODUCT_COLLECTION_FRAGMENT}
  fragment MoneyProductItem on MoneyV2 {
    amount
    currencyCode
  }

  fragment ProductItem on Product {
    id
    title
    description
    handle
    publishedAt
    featuredImage {
      id
      altText
      url
      width
      height
    }
    priceRange {
      minVariantPrice {
        ...MoneyProductItem
      }
      maxVariantPrice {
        ...MoneyProductItem
      }
    }
    variants(first: 1) {
      nodes {
        id
        selectedOptions {
          name
          value
        }
        price {
          amount
          currencyCode
        }
      }
    }
    collections(first:2) {
      nodes {
        ...ProductCollection
      }
    }
  }
` as const;

export const PRODUCT_VARIANT_FRAGMENT = `#graphql
  fragment ProductVariant on ProductVariant {
    availableForSale
    compareAtPrice {
      amount
      currencyCode
    }
    id
    image {
      __typename
      id
      url
      altText
      width
      height
    }
    price {
      amount
      currencyCode
    }
    product {
      title
      handle
    }
    selectedOptions {
      name
      value
    }
    sku
    title
    unitPrice {
      amount
      currencyCode
    }
  }
` as const;

export const PRODUCT_VARIANTS_FRAGMENT = `#graphql
  fragment ProductVariants on Product {
    variants(first: 250) {
      nodes {
        ...ProductVariant
      }
    }
  }
  ${PRODUCT_VARIANT_FRAGMENT}
` as const;

export const PRODUCT_SELECTED_OPTIONS_FRAGMENT = `#graphql
  ${PRODUCT_COLLECTION_FRAGMENT}
  ${PRODUCT_VARIANT_FRAGMENT}

  fragment Product on Product {
    id
    title
    vendor
    handle
    descriptionHtml
    description
    options {
      name
      values
    }
    selectedVariant: variantBySelectedOptions(selectedOptions: $selectedOptions) {
      ...ProductVariant
    }
    variants(first: 1) {
      nodes {
        ...ProductVariant
      }
    }
    collections(first: 2) {
      nodes {
        ...ProductCollection
      }
    }
    seo {
      description
      title
    }
  }
` as const;

export const PRODUCT_VALIDATE_HANDLER_FRAGMENT = `#graphql
  fragment ProductValidateHandler on Product {
    id
    title
    vendor
    selectedVariant: variantBySelectedOptions(selectedOptions: [{name: "asd", value: "asd"}]) {
      id
    }
  }
` as const;

const PAGECOMPONENT_FRAGMENT = `#graphql
  fragment PageComponentMediaImage on MediaImage {
    id
    image {
      url
      width
      height
    }
  }

  fragment PageComponentMetaobject on Metaobject {
    id
    type
    fields {
      key
      value
      type
      reference {
        ...PageComponentMediaImage
      }
    }
  }

  fragment PageComponent on Metaobject {
    id
    type
    fields {
      value
      type
      key
      references(first: 10) {
        nodes {
          ...PageComponentMetaobject
        }
      }
      reference {
        ...PageComponentMediaImage
        ...PageComponentMetaobject
      }
    }
  }
` as const;

const PAGE_FRAGMENT = `#graphql
  fragment Page on Page {
    id
    title
    body
    seo {
      description
      title
    }
    components: metafield(namespace: "custom", key: "components") {
      references(first: 10) {
        nodes {
          ...PageComponent
        }
      }
    }

    options: metafield(namespace: "custom", key: "options") {
      reference {
        ...PageComponent
      }
    }
  }
` as const;

export const PAGE_QUERY = `#graphql
  ${PAGECOMPONENT_FRAGMENT}
  ${PAGE_FRAGMENT}
  query Page(
    $language: LanguageCode,
    $country: CountryCode,
    $handle: String!
  )
  @inContext(language: $language, country: $country) {
    page(handle: $handle) {
      ...Page
    }
  }
` as const;

export const FAQ_QUERY = `#graphql
  ${PAGECOMPONENT_FRAGMENT}
  query FaqQuestions ($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    metaobject(handle: {handle: "index-faq", type: "faq"}) {
      ...PageComponent
    }
  }
` as const;
