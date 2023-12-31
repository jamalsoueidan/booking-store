import {Icon12Hours} from '@tabler/icons-react';
import type {
  PageComponentFragment,
  PageComponentMetaobjectFragment,
  PageComponentPageFragment,
} from 'storefrontapi.generated';
import classes from './DynamicComponents.module.css';
import {Faq} from './Faq';
import {Features, type FeatureProps} from './Features';
import {HeroTitle} from './HeroTitle';
import {Wrapper} from './Wrapper';

export function WrapperHeroTitle({
  component,
}: {
  component: PageComponentFragment;
}) {
  const title = component.fields.find((c) => c.key === 'title');
  const subtitle = component.fields.find((c) => c.key === 'subtitle');

  return (
    <HeroTitle bg="grape.1" subtitle={subtitle?.value} overtitle="">
      {title?.value}
    </HeroTitle>
  );
}

export function WrapperFeatures({
  component,
}: {
  component: PageComponentFragment;
}) {
  const title = component.fields.find((k) => k.key === 'title')?.value || '';
  const subtitle =
    component.fields.find((k) => k.key === 'subtitle')?.value || '';

  const references = component.fields.find((c) => c.key === 'items')?.references
    ?.nodes;

  const items: Array<FeatureProps> =
    references?.map((item) => {
      const assertedItem = item as unknown as PageComponentMetaobjectFragment;
      const title =
        assertedItem.fields.find((k) => k.key === 'title')?.value || '';
      const description =
        assertedItem.fields.find((k) => k.key === 'description')?.value || '';

      return {
        icon: Icon12Hours,
        title,
        description,
      };
    }) || [];

  return <Features title={title} subtitle={subtitle} items={items} />;
}

export function WrapperFaq({component}: {component: PageComponentFragment}) {
  const title = component.fields.find(({key}) => key === 'title')?.value;
  const description = component.fields.find(
    ({key}) => key === 'description',
  )?.value;
  const pages = component.fields.find(({key}) => key === 'pages')?.references
    ?.nodes as unknown as Array<PageComponentPageFragment>;

  return <Faq title={title} description={description} pages={pages || []} />;
}

export function WrapperMaps({component}: {component: PageComponentFragment}) {
  const url = component.fields.find(({key}) => key === 'url')?.value;

  return (
    <Wrapper>
      <div className={classes.googleMap}>
        <iframe
          title="Google Maps"
          src={url + '&key=AIzaSyCRthKA4QW7B1UPbpWuiMJiZ8pPBh4l8uc' || ''}
          width="600"
          height="450"
          allowFullScreen={false}
          className={classes.googleMapIframe}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>
    </Wrapper>
  );
}
