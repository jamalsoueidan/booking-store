import {useLoaderData, type MetaFunction} from '@remix-run/react';
import {json, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import type {ProductVariantFragment} from 'storefrontapi.generated';

import {AspectRatio, Badge, Box, SimpleGrid, Title, rem} from '@mantine/core';
import {Image, Money} from '@shopify/hydrogen';
import {TreatmentStepper} from '~/components/TreatmentStepper';
import {PRODUCT_SELECTED_OPTIONS_QUERY} from '~/data/queries';
import {getBookingShopifyApi} from '~/lib/api/bookingShopifyApi';

export const meta: MetaFunction<typeof loader> = ({data}) => {
  return [{title: `BySisters | ${data?.product.title ?? ''}`}];
};

export function shouldRevalidate() {
  return false;
}

export async function loader({params, request, context}: LoaderFunctionArgs) {
  const {username, productHandle} = params;
  const {storefront} = context;

  if (!productHandle || !username) {
    throw new Response('Expected product handle to be defined', {status: 404});
  }

  try {
    const {payload: userProduct} = await getBookingShopifyApi().userProductGet(
      username,
      productHandle,
    );

    const {product} = await storefront.query(PRODUCT_SELECTED_OPTIONS_QUERY, {
      variables: {
        productHandle,
        selectedOptions: userProduct.selectedOptions,
      },
    });

    if (!product?.id) {
      throw new Response('Product not found', {status: 404});
    }

    return json({product});
  } catch (err) {
    throw new Response('Username or product handle is wrong', {status: 404});
  }
}

const paths = [
  {
    title: 'Beskrivelse',
    path: '',
  },
  {
    title: 'Lokation?',
    path: 'pick-location',
    required: ['locationId'],
    text: 'Vælge en lokation før du kan forsætte...',
  },
  {
    title: 'Andre behandlinger?',
    path: 'pick-more',
  },
  {
    title: 'Dato & Tid?',
    path: 'pick-datetime',
    required: ['fromDate', 'toDate'],
    text: 'Vælge en tid før du kan forsætte...',
  },
  {
    title: 'Godkend',
    path: 'completed',
  },
];

export default function Product() {
  const {product} = useLoaderData<typeof loader>();

  return (
    <SimpleGrid cols={{base: 1, md: 2}} spacing={0}>
      <ProductImage image={product.selectedVariant?.image} />
      <Box p={{base: rem(10), md: rem(42)}} bg="#fafafb">
        <Box mb="xl">
          <Title order={1} size={rem(54)}>
            {product?.title}
          </Title>
          {product.selectedVariant?.price && (
            <Badge variant="light" color="gray" size="lg">
              <Money data={product.selectedVariant?.price} />
            </Badge>
          )}
        </Box>

        <TreatmentStepper paths={paths} product={product} />
      </Box>
    </SimpleGrid>
  );
}

function ProductImage({image}: {image: ProductVariantFragment['image']}) {
  if (!image) {
    return <div className="product-image" />;
  }
  return (
    <AspectRatio ratio={1080 / 1080}>
      <Image
        alt={image.altText || 'Product Image'}
        aspectRatio="1/1"
        data={image}
        key={image.id}
        sizes="(min-width: 45em) 50vw, 100vw"
      />
    </AspectRatio>
  );
}
