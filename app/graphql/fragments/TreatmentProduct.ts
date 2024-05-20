import {LOCATION_FRAGMENT} from '../fragments/Location';

export const TREATMENT_PRODUCT = `#graphql
  ${LOCATION_FRAGMENT}
  fragment TreatmentProduct on Product {
    id
    title
    descriptionHtml
    productType
    handle
    featuredImage {
      id
      altText
      url(transform: { maxHeight: 250, maxWidth: 250, crop: CENTER })
      width
      height
    }
    variants(first: 1) {
      nodes {
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
    parentId: metafield(key: "parentId", namespace: "booking") {
      id
      value
    }
    options: metafield(key: "options", namespace: "booking") {
      id
      value
    }
    scheduleId: metafield(key: "scheduleId", namespace: "booking") {
      id
      value
    }
    locations: metafield(key: "locations", namespace: "booking") {
      references(first: 10) {
        nodes {
          ...Location
        }
      }
    }
    bookingPeriodValue: metafield(key: "booking_period_value", namespace: "booking") {
      id
      value
    }
    bookingPeriodUnit: metafield(key: "booking_period_unit", namespace: "booking") {
      id
      value
    }
    noticePeriodValue: metafield(key: "notice_period_value", namespace: "booking") {
      id
      value
    }
    noticePeriodUnit: metafield(key: "notice_period_unit", namespace: "booking") {
      id
      value
    }
    duration: metafield(key: "duration", namespace: "booking") {
      id
      value
    }
    breaktime: metafield(key: "breaktime", namespace: "booking") {
      id
      value
    }
  }
` as const;
