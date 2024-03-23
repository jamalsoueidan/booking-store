import {type PageFragment} from 'storefrontapi.generated';
import {CallToAction} from '~/components/metaobjects/CallToAction';
import {CardMedia} from '~/components/metaobjects/CardMedia';
import {Faq} from '~/components/metaobjects/Faq';
import {WrapperFeatures} from '~/components/metaobjects/Features';
import {GoogleMap} from '~/components/metaobjects/GoogleMap';
import {Help} from '~/components/metaobjects/Help';
import {SideBySide} from '~/components/metaobjects/SideBySide';
import {VisualTeaser} from '~/components/metaobjects/VisualTeaser';

export const useComponents = (components: PageFragment['components']) => {
  return components?.references?.nodes.map((c) => {
    if (c.type === 'features') {
      return <WrapperFeatures key={c.id} component={c} />;
    } else if (c.type === 'faq') {
      return <Faq key={c.id} component={c} />;
    } else if (c.type === 'maps') {
      return <GoogleMap key={c.id} component={c} />;
    } else if (c.type === 'card_media') {
      return <CardMedia key={c.id} component={c} />;
    } else if (c.type === 'side_by_side') {
      return <SideBySide key={c.id} component={c} />;
    } else if (c.type === 'help') {
      return <Help key={c.id} component={c} />;
    } else if (c.type === 'call_to_action') {
      return <CallToAction key={c.id} component={c} />;
    } else if (c.type === 'visual_teaser') {
      return <VisualTeaser key={c.id} component={c} />;
    } else {
      return <>unknown {c.type}</>;
    }
  });
};
