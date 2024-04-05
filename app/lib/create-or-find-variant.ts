import {parseGid, type Storefront} from '@shopify/hydrogen';

import {getBookingShopifyApi} from '~/lib/api/bookingShopifyApi';
import {type CustomerProductUpsertBody} from '~/lib/api/model';

export type ActionReturnType = Pick<
  CustomerProductUpsertBody,
  'price' | 'compareAtPrice' | 'selectedOptions' | 'productHandle' | 'variantId'
>;

export type createOrFindProductVariantProps = {
  storefront: Storefront<I18nLocale>;
  productId: number | string;
  price: number;
  compareAtPrice: number;
};

export async function createOrFindProductVariant({
  productId,
  price,
  compareAtPrice,
  storefront,
}: createOrFindProductVariantProps) {
  const {product} = await storefront.query(PRODUCT_CREATE_VARIANT_QUERY, {
    variables: {
      Id: `gid://shopify/Product/${productId}`,
      selectedOptions: [
        {
          name: 'Pris',
          value: `Artist ${price}.${compareAtPrice}`,
        },
      ],
    },
  });

  if (!product) {
    throw new Response('Shopify couldnt find product', {
      status: 404,
    });
  }

  if (product.selectedVariant) {
    const response: ActionReturnType = {
      productHandle: product.selectedVariant.product.handle,
      variantId: parseInt(parseGid(product.selectedVariant.id).id),
      price: product.selectedVariant.price,
      selectedOptions: product.selectedVariant.selectedOptions[0],
      compareAtPrice: product.selectedVariant.compareAtPrice
        ? product.selectedVariant.compareAtPrice
        : undefined,
    };
    return response;
  }

  const createdVariant =
    await getBookingShopifyApi().customerProductCreateVariant(
      '0000', // need to figure out how to find the customerId
      productId.toString(),
      {
        compareAtPrice,
        price,
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

  return response;
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
