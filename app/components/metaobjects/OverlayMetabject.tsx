import {Overlay} from '@mantine/core';
import {parseMetafield, type ParsedMetafields} from '@shopify/hydrogen';
import {type PageComponentMetaobjectFragment} from 'storefrontapi.generated';
import {useField} from './utils';

export function OverlayMetaobject({
  metaobject,
}: {
  metaobject: PageComponentMetaobjectFragment | null;
}) {
  const field = useField(metaobject);
  if (!metaobject) return null;

  const color = field.getFieldValue('color');
  const opacity = field.getField('opacity');
  const value =
    opacity && opacity.value
      ? parseMetafield<ParsedMetafields['number_decimal']>(opacity as any)
          .parsedValue
      : 0.6;

  return <Overlay color={color || '#000'} backgroundOpacity={value!} />;
}
