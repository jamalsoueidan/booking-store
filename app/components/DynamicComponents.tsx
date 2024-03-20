import {
  Container,
  Flex,
  Image,
  SimpleGrid,
  Stack,
  Text,
  ThemeIcon,
  Title,
  rem,
} from '@mantine/core';
import {useMediaQuery} from '@mantine/hooks';
import {Icon12Hours, IconHeart} from '@tabler/icons-react';
import type {
  PageComponentFragment,
  PageComponentMetaobjectFragment,
  PageFragment,
} from 'storefrontapi.generated';
import classes from './DynamicComponents.module.css';
import {Faq} from './Faq';
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
    ?.reference?.image;
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
        image={image}
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

export function WrapperSideBySide({
  component,
}: {
  component: PageComponentFragment;
}) {
  const isMobile = useMediaQuery('(max-width: 62em)');

  const title = component.fields.find(({key}) => key === 'title')?.value;
  const text = component.fields.find(({key}) => key === 'text')?.value;

  return (
    <Container size="md" my={rem(80)}>
      <Flex
        justify="space-between"
        align="center"
        style={{flexDirection: isMobile ? 'column' : 'row'}}
        gap="xl"
      >
        <Title fw={500} textWrap="wrap" style={{flex: 1}}>
          {title}
        </Title>
        <Text c="dimmed" size="lg" style={{flex: 1}}>
          {text}
        </Text>
      </Flex>
    </Container>
  );
}

export function WrapperHelp({component}: {component: PageComponentFragment}) {
  const isMobile = useMediaQuery('(max-width: 62em)');
  const title = component.fields.find(({key}) => key === 'title')?.value;
  const backgroundColor = component.fields.find(
    ({key}) => key === 'background_color',
  )?.value;
  const items = component.fields.find(({key}) => key === 'items')?.references
    ?.nodes;

  return (
    <Wrapper bg={backgroundColor || undefined}>
      <Title ta="center" fw={500} size={rem(48)} mb={rem(60)}>
        {title}
      </Title>
      <SimpleGrid cols={{base: 1, sm: 3}} spacing={{base: 'lg', sm: rem(50)}}>
        {items?.map((item) => {
          const title = item.fields.find(({key}) => key === 'title')?.value;
          const description = item.fields.find(
            ({key}) => key === 'description',
          )?.value;
          const color = item.fields.find(({key}) => key === 'color')?.value;

          return (
            <Stack key={item.id} align="center" justify="flex-start">
              <ThemeIcon
                variant="light"
                color={color || 'green'}
                size={rem(200)}
                aria-label="Gradient action icon"
                radius="100%"
              >
                <IconHeart style={{width: '70%', height: '70%'}} />
              </ThemeIcon>
              <Title size={rem(28)} ta="center" fw={400}>
                {title}
              </Title>
              <Text ta="center" size="lg" c="dimmed">
                {description}
              </Text>
            </Stack>
          );
        })}
      </SimpleGrid>
    </Wrapper>
  );
}
