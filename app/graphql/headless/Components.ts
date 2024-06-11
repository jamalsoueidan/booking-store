import {ACCORDION_FRAGMENT} from './Accordion';
import {BACKGROUND_IMAGE_FRAGMENT} from './BackgroundImage';
import {BUTTON_FRAGMENT} from './Button';
import {CALL_TO_ACTION_FRAGMENT} from './CallToAction';
import {CARD_MEDIA_FRAGMENT} from './CardMedia';
import {FAQ_FRAGMENT} from './Faq';
import {FEATURES_FRAGMENT} from './Features';
import {HELP_FRAGMENT} from './Help';
import {IMAGE_FRAGMENT} from './Image';
import {IMAGE_GRID_WITH_HEADER_FRAGMENT} from './ImageWithGridHeader';
import {MAPS_FRAGMENT} from './Maps';
import {OVERLAY_FRAGMENT} from './Overlay';
import {SIDE_BY_SIDE_FRAGMENT} from './SideBySide';
import {VISUAL_TEASER_FRAGMENT} from './VisualTeaser';

export const COMPONENTS_FRAGMENT = `#graphql
  #tags
  ${IMAGE_FRAGMENT}
  ${BACKGROUND_IMAGE_FRAGMENT}
  ${BUTTON_FRAGMENT}
  ${OVERLAY_FRAGMENT}

  #fragments
  ${ACCORDION_FRAGMENT}
  ${CALL_TO_ACTION_FRAGMENT}
  ${CARD_MEDIA_FRAGMENT}
  ${FEATURES_FRAGMENT}
  ${HELP_FRAGMENT}
  ${MAPS_FRAGMENT}
  ${SIDE_BY_SIDE_FRAGMENT}
  ${VISUAL_TEASER_FRAGMENT}
  ${FAQ_FRAGMENT}
  ${IMAGE_GRID_WITH_HEADER_FRAGMENT}

  fragment Components on Metaobject {
    components: field(key: "components") {
      value
      references(first: 5) {
        nodes {
          ...Accordion
          ...CallToAction
          ...CardMedia
          ...Features
          ...Help
          ...Maps
          ...SideBySide
          ...VisualTeaser
          ...Faq
          ...ImageGridWithHeader
        }
      }
    }
  }
` as const;
