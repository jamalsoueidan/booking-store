import {TreatmentCollectionFragment} from '../fragments/TreatmentCollection';

export const FrontendTreatments = `#graphql
  ${TreatmentCollectionFragment}
  query FrontendTreatments(
    $query: String!
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    products(first: 10, sortKey: RELEVANCE, query: $query) {
      nodes {
        ...TreatmentCollection
      }
    }
  }
` as const;
