import {
  BackgroundImage,
  Box,
  Container,
  Stack,
  Title,
  getGradient,
  rem,
  useMantineTheme,
} from '@mantine/core';
import type {Image, Maybe} from '@shopify/hydrogen/storefront-api-types';
import type {PageComponentFragment} from 'storefrontapi.generated';
import {TransformText} from './TransformText';
import classes from './VisualTeaser.module.css';
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
  subtitle,
  image,
  opacity,
  style,
  height,
  fontColor,
  justify,
}: VisualTeaserComponentProps) => {
  const theme = useMantineTheme();

  return (
    <Box
      bg={getGradient(
        {deg: 180, from: backgroundColor || 'white', to: 'white'},
        theme,
      )}
      className={classes.box}
    >
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
          {title ? (
            <TransformText input={title} c={fontColor || 'black'} />
          ) : null}
          {subtitle ? (
            <Title
              order={2}
              ta="center"
              fw="normal"
              lineClamp={2}
              c={fontColor || 'dimmed'}
            >
              {subtitle}
            </Title>
          ) : null}
        </Stack>
      </Container>
    </Box>
  );
};
