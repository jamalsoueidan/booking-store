import {ArtistUserFragment} from '../artist/ArtistUser';

export const FrontendUsers = `#graphql
  ${ArtistUserFragment}
  query FrontUsers(
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    metaobjects(type: "user", first: 20) {
      nodes {
        ...ArtistUser
      }
    }
  }
` as const;
