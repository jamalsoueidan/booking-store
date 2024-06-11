import {BackgroundImage, Container, Stack, Title, rem} from '@mantine/core';
import {type CallToActionFragment} from 'storefrontapi.generated';
import {ButtonMetaobject} from './ButtonMetaobject';
import {OverlayMetaobject} from './OverlayMetabject';

export function CallToAction({component}: {component: CallToActionFragment}) {
  const image = component.image?.reference;
  const title = component.title?.value;
  const color = component.color?.value;
  const button = component.button?.reference;
  const overlay = component.overlay?.reference;

  return (
    <BackgroundImage
      src={image?.image?.url || ''}
      bg="gray.4"
      style={{position: 'relative'}}
    >
      {overlay ? <OverlayMetaobject data={overlay} /> : null}
      <Container
        size="md"
        py={rem(80)}
        style={{position: 'relative', zIndex: 201}}
      >
        <Stack justify="center" align="center" gap="xl">
          <Title
            ta="center"
            c={color || 'black'}
            textWrap="pretty"
            style={{whiteSpace: 'pre-line'}}
          >
            {title}
          </Title>
          {button && <ButtonMetaobject data={button} />}
        </Stack>
      </Container>
    </BackgroundImage>
  );
}
