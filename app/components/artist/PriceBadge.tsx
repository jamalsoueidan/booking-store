import {Flex, Text, type TextProps} from '@mantine/core';
import type {Maybe, MoneyV2} from '@shopify/hydrogen/storefront-api-types';
import {useMemo} from 'react';
import {useTranslation} from 'react-i18next';

export function PriceBadge({
  price,
  compareAtPrice,
  options,
  ...props
}: {
  price: Pick<MoneyV2, 'amount' | 'currencyCode'>;
  compareAtPrice?: Maybe<Pick<MoneyV2, 'amount' | 'currencyCode'>>;
  options?: string | null;
} & TextProps) {
  const {t} = useTranslation(['global']);
  const discountString = useMemo(() => {
    if (compareAtPrice?.amount && compareAtPrice?.amount !== '0.0') {
      const discountAmount =
        parseInt(compareAtPrice?.amount) - parseInt(price.amount);
      const discountPercentage = Math.abs(
        (discountAmount / parseInt(compareAtPrice?.amount)) * 100,
      );
      return `${t('discount')} ${discountPercentage.toFixed(0)}%`;
    }
    return null;
  }, [compareAtPrice?.amount, price.amount, t]);

  return (
    <Flex direction="column" gap="4px" justify="flex-start" align="flex-end">
      <Text size="sm" {...props}>
        {options ? t('from') : ''} {price.amount} kr
      </Text>
      {discountString ? (
        <Text c="green.9" size="sm">
          {discountString}
        </Text>
      ) : (
        <br />
      )}
    </Flex>
  );
}
