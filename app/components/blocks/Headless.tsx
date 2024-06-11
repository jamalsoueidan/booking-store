import {type ComponentsFragment} from 'storefrontapi.generated';
import {CallToAction} from '~/components/blocks/CallToAction';
import {CardMedia} from '~/components/blocks/CardMedia';
import {Faq} from '~/components/blocks/Faq';
import {Features} from '~/components/blocks/Features';
import {GoogleMap} from '~/components/blocks/GoogleMap';
import {Help} from '~/components/blocks/Help';
import {ImageGridWithHeader} from '~/components/blocks/ImageGridWithHeader';
import {SideBySide} from '~/components/blocks/SideBySide';
import {VisualTeaser} from '~/components/blocks/VisualTeaser';

export function Headless({
  components,
}: {
  components?: ComponentsFragment['components'] | null;
}) {
  return components?.references?.nodes.map((c) => {
    if (c.type === 'features') {
      return <Features key={c.id} data={c} />;
    } else if (c.type === 'faq') {
      return <Faq key={c.id} data={c} />;
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
      return <VisualTeaser key={c.id} data={c} />;
    } else if (c.type === 'image_grid_with_header') {
      return <ImageGridWithHeader key={c.id} data={c} />;
    } else {
      return <div key={c.id}>unknown {c.type}</div>;
    }
  });
}
