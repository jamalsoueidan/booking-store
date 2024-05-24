export const TREATMENT_OPTION_VARIANT_FRAGMENT = `#graphql
  fragment TreatmentOptionVariant on ProductVariant {
    id
    title
    image {
      id
      url(transform: { maxHeight: 100, maxWidth: 100, crop: CENTER })
      altText
      width
      height
    }
    price {
      amount
      currencyCode
    }
    compareAtPrice {
      amount
      currencyCode
    }
    selectedOptions {
      name
      value
    }
    duration: metafield(key: "duration", namespace: "booking") {
      value
    }
  }
` as const;

export const TREATMENT_OPTION_FRAGMENT = `#graphql
  ${TREATMENT_OPTION_VARIANT_FRAGMENT}

  fragment TreatmentOption on Product {
    id
    title
    handle
    description
    options {
      name
      values
    }
    variants(first: 5) {
      nodes {
        ...TreatmentOptionVariant
      }
    }
    parentId: metafield(key: "parentId", namespace: "booking") {
      value
    }
    required: metafield(key: "required", namespace: "system") {
      value
    }
  }
` as const;
