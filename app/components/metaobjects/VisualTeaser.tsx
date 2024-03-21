import {
  BackgroundImage,
  Box,
  Container,
  Stack,
  Title,
  rem,
} from '@mantine/core';
import {Image, Maybe} from '@shopify/hydrogen/storefront-api-types';
import type {PageComponentFragment} from 'storefrontapi.generated';
import classes from './VisualTeaser.module.css';
import {useField} from './utils';

export function VisualTeaser({
  component,
}: {
  component?: PageComponentFragment | null;
}) {
  const field = useField(component);
  const title = field.getFieldValue('title');
  const overtitle = field.getFieldValue('overtitle');
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

  if (!component) return null;

  return (
    <VisualTeaserComponent
      backgroundColor={backgroundColor}
      title={title}
      overtitle={overtitle}
      subtitle={subtitle}
      image={image}
      opacity={opacity}
      style={style}
      fontColor={fontColor}
      justify={justify}
      height={height}
    />
  );
}

export type VisualTeaserComponentProps = {
  backgroundColor?: string;
  title?: string;
  overtitle?: string;
  subtitle?: string;
  image?: Maybe<Pick<Image, 'url' | 'width' | 'height'>>;
  opacity?: string;
  style?: Record<string, string>;
  height?: string;
  fontColor?: string;
  justify?: string;
};

export const VisualTeaserComponent = ({
  backgroundColor,
  title,
  overtitle,
  subtitle,
  image,
  opacity,
  style,
  height,
  fontColor,
  justify,
}: VisualTeaserComponentProps) => {
  return (
    <Box bg={backgroundColor || 'gray.1'} className={classes.box}>
      {image ? (
        <BackgroundImage
          src={image?.url || ''}
          opacity={opacity || 1}
          style={{
            ...style,
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

      <Container size="lg" py={0} h={height} className={classes.container}>
        <Stack pt={rem(30)} pb={rem(50)} justify={justify || 'center'} h="100%">
          {title || overtitle ? (
            <div>
              {overtitle ? (
                <Title
                  order={5}
                  tt="uppercase"
                  fw={300}
                  ta="center"
                  c={fontColor || 'black'}
                  className={classes.overtitle}
                >
                  {overtitle}
                </Title>
              ) : null}
              {title ? (
                <Title
                  order={1}
                  fw={500}
                  ta="center"
                  textWrap="balance"
                  className={classes.root}
                  c={fontColor || 'black'}
                >
                  {title}
                </Title>
              ) : null}
            </div>
          ) : null}
          {subtitle ? (
            <Title
              order={3}
              ta="center"
              fw={300}
              className={classes.subtitle}
              c={fontColor || 'black'}
            >
              {subtitle}
            </Title>
          ) : null}
        </Stack>
      </Container>
    </Box>
  );
};
