import {rem, ThemeIcon} from '@mantine/core';
import {
  IconBasket,
  IconBeach,
  IconHeart,
  IconSearch,
} from '@tabler/icons-react';
import {type ThemeIconFragment} from 'storefrontapi.generated';

const icons: Record<string, any> = {
  beach: IconBeach,
  search: IconSearch,
  basket: IconBasket,
  '': IconHeart,
};

export function ThemeIconMetaobject({data}: {data: ThemeIconFragment}) {
  const variant = data.variant?.value;
  const icon = data.icon?.value;
  const color = data.color?.value;
  const radius = data.radius?.value;

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
