import {type FieldMetadata} from '@conform-to/react';
import React, {useEffect} from 'react';

import {useFetcher} from '@remix-run/react';
import {parseGid} from '@shopify/hydrogen';
import {type ProductVariantFragment} from 'storefrontapi.generated';
import {RadioGroup} from './RadioGroup';

interface RadioRadioVariantsProductProps {
  label: string;
  productId: string;
  field: FieldMetadata<string> | FieldMetadata<number>;
}

export const RadioGroupVariantsProduct: React.FC<
  RadioRadioVariantsProductProps
> = ({productId, label, field}: RadioRadioVariantsProductProps) => {
  const fetcher = useFetcher<ProductVariantFragment[]>();

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
