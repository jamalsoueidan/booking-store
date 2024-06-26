import {BACKGROUND_IMAGE_FRAGMENT} from '../headless/BackgroundImage';
import {BUTTON_FRAGMENT} from '../headless/Button';
import {COMPONENTS_FRAGMENT} from '../headless/Components';
import {IMAGE_FRAGMENT} from '../headless/Image';
import {VISUAL_TEASER_FRAGMENT} from '../headless/VisualTeaser';

export const METAFIELD_QUERY = `#graphql
  ${COMPONENTS_FRAGMENT}
  query MetaobjectQuery ($country: CountryCode, $language: LanguageCode, $handle: String!, $type: String!)
    @inContext(country: $country, language: $language) {
    metaobject(handle: {handle: $handle, type: $type}) {
      ...Components
    }
  }
` as const;

export const METAFIELD_VISUAL_TEASER_QUERY = `#graphql
  ${IMAGE_FRAGMENT}
  ${BACKGROUND_IMAGE_FRAGMENT}
  ${BUTTON_FRAGMENT}
  ${VISUAL_TEASER_FRAGMENT}

  query MetaobjectVisualTeaserQuery ($country: CountryCode, $language: LanguageCode, $handle: String!, $type: String!)
    @inContext(country: $country, language: $language) {
    metaobject(handle: {handle: $handle, type: $type}) {
      ...VisualTeaser
    }
  }
` as const;
