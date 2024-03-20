import {BackgroundImage, Container, Stack, Title, rem} from '@mantine/core';
import type {PageComponentFragment} from 'storefrontapi.generated';
import {ButtonMetaobject} from './ButtonMetaobject';
import {OverlayMetaobject} from './OverlayMetabject';
import {useField} from './utils';

export function CallToAction({component}: {component: PageComponentFragment}) {
  const field = useField(component);
  const image = field.getImage('image');
  const title = field.getFieldValue('title');
  const color = field.getFieldValue('color');
  const button = field.getMetaObject('button');
  const overlay = field.getMetaObject('overlay');

  return (
    <BackgroundImage src={image?.url || ''} style={{position: 'relative'}}>
      <OverlayMetaobject metaobject={overlay} />
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
          <ButtonMetaobject metaobject={button} />
        </Stack>
      </Container>
    </BackgroundImage>
  );
}
