import {Overlay} from '@mantine/core';
import type {OverlayFragment} from 'storefrontapi.generated';

export function OverlayMetaobject({data}: {data: OverlayFragment}) {
  const color = data.color?.value;
  const opacity = data.opacity;
  const value = opacity?.value ? parseInt(opacity.value) : 0.6;

  return <Overlay color={color || '#000'} backgroundOpacity={value!} />;
}
