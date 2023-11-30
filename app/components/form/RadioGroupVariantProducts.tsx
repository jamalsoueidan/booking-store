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

  const onChange = (value: string) => {
    const variant = fetcher.data?.find(
      (variant) => parseGid(variant.id).id === value,
    );
    if (variant) {
      setSelectedOptions(
        variant.selectedOptions.length > 0
          ? variant.selectedOptions[0]
          : {
              name: '',
              value: '',
            },
      );
    }
  };

  useEffect(() => {
    fetcher.load(`/api/products/${productId}/variants`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId]);

  return (
    <>
      <input
        type="hidden"
        name="selectedOptions.name"
        value={selectedOptions?.name}
        onChange={() => {}}
      />
      <input
        type="hidden"
        name="selectedOptions.value"
        value={selectedOptions?.value}
        onChange={() => {}}
      />
      <RadioGroup
        onChange={onChange}
        label={label}
        data={data || []}
        field={field}
      />
    </>
  );
};
