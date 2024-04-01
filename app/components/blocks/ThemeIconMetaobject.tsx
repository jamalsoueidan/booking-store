import {rem, ThemeIcon} from '@mantine/core';
import {
  IconBasket,
  IconBeach,
  IconHeart,
  IconSearch,
} from '@tabler/icons-react';
import {type PageComponentMetaobjectFragment} from 'storefrontapi.generated';
import {useField} from './utils';

const icons: Record<string, any> = {
  beach: IconBeach,
  search: IconSearch,
  basket: IconBasket,
  '': IconHeart,
};

export function ThemeIconMetaobject({
  metaobject,
}: {
  metaobject: PageComponentMetaobjectFragment | null;
}) {
  const field = useField(metaobject);
  if (!metaobject) return null;

  const variant = field.getFieldValue('variant');
  const icon = field.getFieldValue('icon');
  const color = field.getFieldValue('color');
  const radius = field.getFieldValue('radius');

  const IconComponent = icons[icon || ''];

  return (
    <ThemeIcon
      variant={variant || 'transparent'}
      color={color || 'green'}
      size={rem(200)}
      aria-label="icon"
      radius={radius || '100%'}
    >
      <IconComponent stroke={0.5} style={{width: '70%', height: '70%'}} />
    </ThemeIcon>
  );
}
