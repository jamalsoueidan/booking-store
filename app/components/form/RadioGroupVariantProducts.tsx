import {type FieldConfig} from '@conform-to/react';
import React, {useEffect, useState} from 'react';

import {useFetcher} from '@remix-run/react';
import {parseGid} from '@shopify/hydrogen';
import {type ProductVariantFragment} from 'storefrontapi.generated';
import type {CustomerProductUpsertBodySelectedOptions} from '~/lib/api/model';
import {RadioGroup} from './RadioGroup';

interface RadioRadioVariantsProductProps {
  label: string;
  productId: string;
  field: FieldConfig<string>;
}

export const RadioGroupVariantsProduct: React.FC<
  RadioRadioVariantsProductProps
> = ({productId, label, field}: RadioRadioVariantsProductProps) => {
  const fetcher = useFetcher<ProductVariantFragment[]>();

  const [selectedOptions, setSelectedOptions] =
    useState<CustomerProductUpsertBodySelectedOptions>({
      name: '',
      value: '',
    });

  const data = fetcher.data
    ?.sort((a, b) => parseFloat(a.price.amount) - parseFloat(b.price.amount))
    .map((variant) => {
      return {
        label: `${variant.price.amount} ${variant.price.currencyCode} / ${variant.compareAtPrice?.amount}`,
        value: parseGid(variant.id).id,
      };
    });

  useEffect(() => {
    fetcher.load(`/api/products/${productId}/variants`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId]);

  return (
    <>
      <RadioGroup label={label} data={data || []} field={field} />
    </>
  );
};
