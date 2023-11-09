import {type FieldConfig} from '@conform-to/react';
import React from 'react';
import {type AccountServicesProductsQuery} from 'storefrontapi.generated';

import {parseGid} from '@shopify/hydrogen';
import {RadioGroup} from './RadioGroup';

interface RadioRadioVariantsProductProps {
  label: string;
  product: AccountServicesProductsQuery['products']['nodes'][0];
  field: FieldConfig<string>;
}

export const RadioGroupVariantsProduct: React.FC<
  RadioRadioVariantsProductProps
> = ({product, label, field}: RadioRadioVariantsProductProps) => {
  const data = product?.variants.nodes
    .sort((a, b) => parseFloat(a.price.amount) - parseFloat(b.price.amount))
    .map((variant) => ({
      label: `${variant.price.amount} ${variant.price.currencyCode}`,
      value: parseGid(variant.id).id,
    }));

  return <RadioGroup label={label} data={data} field={field} />;
};
