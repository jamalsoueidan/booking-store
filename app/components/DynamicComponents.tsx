import {Container, Flex, Image, Stack, Text, Title, rem} from '@mantine/core';
import {useMediaQuery} from '@mantine/hooks';
import {Icon12Hours} from '@tabler/icons-react';
import type {
  PageComponentFragment,
  PageComponentMetaobjectFragment,
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
  const bg = component.fields.find(
    ({key}) => key === 'background_color',
  )?.value;
  const title = component.fields.find(({key}) => key === 'title')?.value;
  const description = component.fields.find(
    ({key}) => key === 'description',
  )?.value;
  const questions = component.fields.find(({key}) => key === 'questions')
    ?.references?.nodes as any;

  return (
    <Wrapper bg={bg || undefined}>
      <Faq
        title={title}
        description={description}
        questions={questions || []}
      />
    </Wrapper>
  );
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

export function WrapperCardMedia({
  component,
}: {
  component: PageComponentFragment;
}) {
  const isMobile = useMediaQuery('(max-width: 62em)');

  const title = component.fields.find(({key}) => key === 'title')?.value;
  const description = component.fields.find(
    ({key}) => key === 'description',
  )?.value;

  const image = component.fields.find(({key}) => key === 'image')?.reference
    ?.image;
  const flip =
    !isMobile &&
    component.fields.find(({key}) => key === 'flip')?.value === 'true';

  return (
    <Container size="md" my={rem(80)}>
      <Flex
        justify="space-between"
        gap={{base: 'lg', sm: rem(120)}}
        style={{flexDirection: isMobile ? 'column' : 'row'}}
      >
        <Stack style={{order: flip ? 2 : 1, flex: 1}} gap="lg">
          <Title fw={500}>{title}</Title>
          <Text c="dimmed" size="lg">
            {description}
          </Text>
        </Stack>
        <Image
          src={image?.url}
          height={200}
          w="auto"
          radius="xl"
          style={{order: flip ? 1 : 2, flex: 1}}
        />
      </Flex>
    </Container>
  );
}
