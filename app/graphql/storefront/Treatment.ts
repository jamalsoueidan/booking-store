export const TreatmentFragment = `#graphql
  fragment TreatmentProduct on Product {
    id
    title
    descriptionHtml
    productType
    handle
    vendor
    featuredImage {
      id
      altText
      url(transform: { maxHeight: 250, maxWidth: 250, crop: CENTER })
      width
      height
    }
    variants(first: 1) {
      nodes {
        id
        compareAtPrice {
          amount
          currencyCode
        }
        price {
          amount
          currencyCode
        }
      }
    }
  }
` as const;

export const Treatment = `#graphql
${TreatmentFragment}
  query Treatment(
    $productHandle: String!
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    product(handle: $productHandle) {
      ...TreatmentProduct
    }
  }
` as const;
