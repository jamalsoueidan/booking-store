import {Badge, type BadgeProps, Text} from '@mantine/core';
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
  return (
    <Badge variant="outline" size="lg" color="black" {...props}>
      {compareAtPrice && compareAtPrice?.amount !== '0.0' ? (
        <Text fz="xs" component="span" td="line-through">
          <Money as="span" data={compareAtPrice} />
        </Text>
      ) : null}{' '}
      <Text fz="sm" fw="bold" component="span">
        <Money as="span" data={price} />
      </Text>
    </Badge>
  );
}
