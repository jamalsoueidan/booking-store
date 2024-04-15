import {
  BackgroundImage,
  Box,
  Button,
  Container,
  Flex,
  Stack,
  Title,
  getGradient,
  rem,
  useMantineTheme,
} from '@mantine/core';
import {Link} from '@remix-run/react';
import type {Image, Maybe} from '@shopify/hydrogen/storefront-api-types';
import type {
  PageComponentFragment,
  PageComponentMetaobjectFragment,
} from 'storefrontapi.generated';
import {H1} from '../titles/H1';
import {useField} from './utils';

export function VisualTeaser({
  component,
}: {
  component?: PageComponentFragment | null;
}) {
  const field = useField(component);
  const title = field.getFieldValue('title');
  const subtitle = field.getFieldValue('subtitle');
  const backgroundColor = field.getFieldValue('background_color');
  const fontColor = field.getFieldValue('font_color');
  const justify = field.getFieldValue('justify');
  const height = field.getFieldValue('height');

  const backgroundImage = field.getMetaObject('background_image');
  const backgroundField = useField(backgroundImage);
  const image = backgroundField.getImage('image');
  const opacity = backgroundField.getFieldValue('opacity');
  const style = backgroundField.getJSON('style');

  const subbutton = field.getMetaObject('subbutton');

  if (!component) return null;

  return (
    <VisualTeaserComponent
      backgroundColor={backgroundColor}
      title={title}
      subtitle={subtitle}
      image={image}
      opacity={opacity}
      style={style}
      fontColor={fontColor}
      justify={justify}
      height={height}
      subbutton={subbutton}
    />
  );
}

export type VisualTeaserComponentProps = {
  backgroundColor?: string;
  title?: string;
  overtitle?: string;
  subtitle?: string;
  image?: Maybe<Pick<Image, 'url' | 'width' | 'height'>>;
  subbutton: PageComponentMetaobjectFragment | null;
  opacity?: string;
  style?: Record<string, string>;
  height?: string;
  fontColor?: string;
  justify?: string;
};

export const VisualTeaserComponent = ({
  backgroundColor,
  title,
  subtitle,
  image,
  opacity,
  style,
  height,
  fontColor,
  justify,
  subbutton,
}: VisualTeaserComponentProps) => {
  const theme = useMantineTheme();

  const subbuttonField = useField(subbutton);
  const linkTo = subbuttonField.getFieldValue('link_to');
  const text = subbuttonField.getFieldValue('text');

  return (
    <Box
      bg={getGradient(
        {deg: 180, from: backgroundColor || 'white', to: 'white'},
        theme,
      )}
      pt={'70px'} //because of App.Header
      style={{position: 'relative', overflow: 'hidden'}}
    >
      {image ? (
        <BackgroundImage
          src={image?.url || ''}
          opacity={opacity || 1}
          bgsz={{base: 'cover', xs: 'contain'}}
          bgp="center"
          bgr="no-repeat"
          style={{
            borderBottomRightRadius: '40% 15%',
            borderBottomLeftRadius: '40% 15%',
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            top: 0,
          }}
        ></BackgroundImage>
      ) : null}

      <Container size="lg" py={0} h={height} pos="relative" style={{zIndex: 1}}>
        <Stack pt={rem(30)} pb={rem(50)} justify={justify || 'center'} h="100%">
          {title ? (
            <H1
              c={fontColor || 'black'}
              gradients={{from: 'orange', to: 'orange.3'}}
            >
              {title}
            </H1>
          ) : null}
          {subtitle ? (
            <Title order={2} ta="center" fw="normal" c={fontColor || 'dimmed'}>
              {subtitle}
            </Title>
          ) : null}
          {subbutton ? (
            <Flex justify="center">
              <Button
                variant="default"
                size="lg"
                component={Link}
                to={linkTo || ''}
              >
                {text}
              </Button>
            </Flex>
          ) : null}
        </Stack>
      </Container>
    </Box>
  );
};
