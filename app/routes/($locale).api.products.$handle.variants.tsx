import {json, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {type ProductVariantFragment} from 'storefrontapi.generated';

import {VARIANTS_QUERY, VARIANTS_QUERY_ID} from '~/data/queries';

export async function loader({params, context}: LoaderFunctionArgs) {
  const {handle} = params;
  const {storefront} = context;

  if (!handle) {
    throw new Error('Expected product handle to be defined');
  }

  const productId = parseInt(handle);
  const variants = await storefront.query(
    isNaN(productId) ? VARIANTS_QUERY : VARIANTS_QUERY_ID,
    {
      variables: isNaN(productId)
        ? {handle}
        : {handle: `gid://shopify/Product/${productId}`},
    },
  );

  return json(
    (variants.product?.variants.nodes as ProductVariantFragment[]) ||
      ([] as ProductVariantFragment[]),
  );
}
