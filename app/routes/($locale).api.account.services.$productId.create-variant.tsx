import {json, type ActionFunctionArgs} from '@shopify/remix-oxygen';
import {z} from 'zod';

import {getBookingShopifyApi} from '~/lib/api/bookingShopifyApi';
import {type CustomerProductUpsertBody} from '~/lib/api/model';

const schema = z.object({
  price: z.number(),
  compareAtPrice: z.number(),
});

function isProps(object: any): object is z.infer<typeof schema> {
  return 'price' in object && 'compareAtPrice' in object;
}

export type ActionReturnType = Pick<
  CustomerProductUpsertBody,
  'price' | 'compareAtPrice' | 'selectedOptions' | 'productHandle' | 'variantId'
>;

/*
 * TODO: Authentication customer to use this method
 */

export async function action({context, params, request}: ActionFunctionArgs) {
  const {productId} = params;
  if (!productId) {
    throw new Response('Expected product id to be defined');
  }

  const formData = await request.json();
  if (isProps(formData)) {
    const {product} = await context.storefront.query(
      PRODUCT_CREATE_VARIANT_QUERY,
      {
        variables: {
          Id: `gid://shopify/Product/${productId}`,
          selectedOptions: [
            {
              name: 'Pris',
              value: `Artist ${formData.price}.${formData.compareAtPrice}`,
            },
          ],
        },
      },
    );

    if (!product) {
      throw new Response('Shopify couldnt find product', {
        status: 404,
      });
    }

    if (product.selectedVariant) {
      const response: ActionReturnType = {
        productHandle: product.selectedVariant.product.handle,
        variantId: parseInt(product.selectedVariant.id),
        price: product.selectedVariant.price,
        selectedOptions: product.selectedVariant.selectedOptions[0],
        compareAtPrice: product.selectedVariant.compareAtPrice
          ? product.selectedVariant.compareAtPrice
          : undefined,
      };
      return json(response);
    } else {
      const createdVariant =
        await getBookingShopifyApi().customerProductCreateVariant(
          '0000', // need to figure out how to find the customerId
          productId,
          {
            compareAtPrice: formData.compareAtPrice,
            price: formData.price,
          },
        );

      if (!createdVariant.success) {
        throw new Error((createdVariant as any).errors);
      }

      const variant = createdVariant.payload;
      const response: ActionReturnType = {
        variantId: variant.id,
        selectedOptions: variant.selectedOptions[0],
        productHandle: variant.product.handle,
        price: {
          amount: String(variant.price),
          currencyCode: 'DKK',
        },
        compareAtPrice: {
          amount: String(variant.compareAtPrice),
          currencyCode: 'DKK',
        },
      };

      return json(response);
    }
  }
}

const PRODUCT_CREATE_VARIANT_FRAGMENT = `#graphql
  fragment ProductCreateVariant on ProductVariant {
    id
    title
    compareAtPrice {
      amount
      currencyCode
    }
    price {
      amount
      currencyCode
    }
    product {
      title
      handle
    }
    selectedOptions {
      name
      value
    }
  }
` as const;

const PRODUCT_CREATE_VARIANT_QUERY = `#graphql
  ${PRODUCT_CREATE_VARIANT_FRAGMENT}
  query ProductCreateVariantId(
    $country: CountryCode
    $Id: ID!
    $language: LanguageCode
    $selectedOptions: [SelectedOptionInput!]!
  ) @inContext(country: $country, language: $language) {
    product(id: $Id) {
      ...on Product {
        selectedVariant: variantBySelectedOptions(selectedOptions: $selectedOptions) {
          ...ProductCreateVariant
        }
      }
    }
  }
` as const;
