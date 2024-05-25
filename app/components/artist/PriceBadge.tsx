import {
  Badge,
  type BadgeProps,
  type MantineSize,
  rem,
  Text,
} from '@mantine/core';
import {Money} from '@shopify/hydrogen';
import type {Maybe, MoneyV2} from '@shopify/hydrogen/storefront-api-types';

export function PriceBadge({
  price,
  compareAtPrice,
  ...props
}: {
  price: Pick<MoneyV2, 'amount' | 'currencyCode'>;
  compareAtPrice?: Maybe<Pick<MoneyV2, 'amount' | 'currencyCode'>>;
} & BadgeProps) {
  const sizes: Record<
    MantineSize | any,
    {compareAtPrice: string; price: string}
  > = {
    sm: {
      compareAtPrice: rem(11),
      price: rem(13),
    },
    lg: {
      compareAtPrice: 'xs',
      price: 'sm',
    },
  };

  const size = props.size
    ? sizes[props.size]
    : {
        compareAtPrice: 'xs',
        price: 'sm',
      };

  return (
    <Badge variant="outline" size="lg" color="black" {...props}>
      {compareAtPrice && compareAtPrice?.amount !== '0.0' ? (
        <Text fz={size.compareAtPrice} component="span" td="line-through">
          <Money as="span" data={compareAtPrice} />
        </Text>
      ) : null}{' '}
      <Text fz={size.compareAtPrice} fw="bold" component="span">
        <Money as="span" data={price} />
      </Text>
    </Badge>
  );
}
