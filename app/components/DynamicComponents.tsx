import {Icon12Hours} from '@tabler/icons-react';
import type {
  PageComponentFragment,
  PageComponentMediaImageFragment,
  PageComponentMetaobjectFragment,
  PageFragment,
} from 'storefrontapi.generated';
import {Features, type FeatureProps} from './Features';
import {HeroTitle} from './HeroTitle';
import {Wrapper} from './Wrapper';

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

export const WrapperHeroTitle = ({title, body, options}: PageFragment) => {
  const backgroundColor = options?.reference?.fields.find(
    (p) => p.key === 'background_color',
  )?.value;
  const fontColor = options?.reference?.fields.find(
    (p) => p.key === 'font_color',
  )?.value;
  const justify = options?.reference?.fields.find(
    (p) => p.key === 'justify',
  )?.value;
  const overtitle = options?.reference?.fields.find(
    (p) => p.key === 'overtitle',
  )?.value;
  const subtitle = options?.reference?.fields.find(
    (p) => p.key === 'subtitle',
  )?.value;
  const image = options?.reference?.fields.find((p) => p.key === 'image')
    ?.reference as unknown as PageComponentMediaImageFragment;
  const height = options?.reference?.fields.find(
    (p) => p.key === 'height',
  )?.value;

  return (
    <>
      <HeroTitle
        overtitle={overtitle}
        subtitle={subtitle}
        fontColor={fontColor}
        justify={justify}
        h={height ? `${parseInt(height)}px` : undefined}
        bg={backgroundColor || 'gray.1'}
        image={image.image}
      >
        {title}
      </HeroTitle>

      {body.length > 1 && (
        <Wrapper>
          <main dangerouslySetInnerHTML={{__html: body}} />
        </Wrapper>
      )}
    </>
  );
};
