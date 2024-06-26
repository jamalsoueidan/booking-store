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
      url(transform: { maxHeight: 250, maxWidth: 250, crop: CENTER })
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
