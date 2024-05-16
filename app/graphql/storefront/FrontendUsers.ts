import {UserFragment} from '../metafields/user';

export const FrontendUsers = `#graphql
  ${UserFragment}
  query FrontUsers(
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    metaobjects(type: "user", first: 20) { #we have increased to 20 incase some users is active=false, we cannot filtre on metaobjects
      nodes {
        ...User
      }
    }
  }
` as const;
