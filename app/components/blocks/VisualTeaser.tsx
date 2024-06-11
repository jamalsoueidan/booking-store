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
import type {VisualTeaserFragment} from 'storefrontapi.generated';
import {H1} from '../titles/H1';

export const VisualTeaser = ({data}: {data?: VisualTeaserFragment | null}) => {
  const theme = useMantineTheme();

  if (!data) return null;

  const title = data.title?.value;
  const subtitle = data.subtitle?.value;
  const backgroundColor = data.backgroundColor?.value;
  const fontColor = data.fontColor?.value;
  const justify = data.justify?.value;
  const height = data.height?.value;

  const image = data.backgroundImage?.reference?.image?.reference?.image;
  const opacity = data.backgroundImage?.reference?.opacity?.value;
  const style = data.backgroundImage?.reference?.style?.value;

  const subbutton = data.subbutton?.reference;
  const linkTo = subbutton?.linkTo?.value;
  const text = subbutton?.text?.value;

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

      <Container
        size="lg"
        py={0}
        h={height || undefined}
        pos="relative"
        style={{zIndex: 1}}
      >
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
