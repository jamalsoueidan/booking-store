import {useLoaderData, type MetaFunction} from '@remix-run/react';
import {json, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import type {ProductVariantFragment} from 'storefrontapi.generated';

import {AspectRatio, Box, SimpleGrid, Title, rem} from '@mantine/core';
import {Image, getSelectedProductOptions} from '@shopify/hydrogen';
import {TreatmentStepper} from '~/components/TreatmentStepper';
import {PRODUCT_SELECTED_OPTIONS_QUERY} from '~/data/queries';

export function shouldRevalidate() {
  return false;
}

export const meta: MetaFunction<typeof loader> = ({data}) => {
  return [{title: `BySisters | ${data?.product.title ?? ''}`}];
};

export async function loader({params, request, context}: LoaderFunctionArgs) {
  const {productHandle} = params;
  const {storefront} = context;

  const selectedOptions = getSelectedProductOptions(request).filter(
    (option) =>
      // Filter out Shopify predictive search query params
      !option.name.startsWith('_sid') &&
      !option.name.startsWith('_pos') &&
      !option.name.startsWith('_psq') &&
      !option.name.startsWith('_ss') &&
      !option.name.startsWith('_v') &&
      // Filter out third party tracking params
      !option.name.startsWith('fbclid'),
  );

  if (!productHandle) {
    throw new Error('Expected product handle to be defined');
  }

  // await the query for the critical product data
  const {product} = await storefront.query(PRODUCT_SELECTED_OPTIONS_QUERY, {
    variables: {productHandle, selectedOptions},
  });

  if (!product?.id) {
    throw new Response(null, {status: 404});
  }

  const firstVariant = product.variants.nodes[0];
  product.selectedVariant = firstVariant;

  return json({product});
}

const paths = [
  {
    title: 'Beskrivelse',
    path: '',
  },
  {
    title: 'Skønhedsekspert?',
    path: 'pick-username',
    required: ['username'],
    text: 'Vælge en skønhedsekspert før du kan forsætte...',
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
  const {selectedVariant} = product;

  return (
    <SimpleGrid cols={{base: 1, md: 2}} spacing={0}>
      <ProductImage image={selectedVariant?.image} />
      <Box p={{base: rem(10), md: rem(42)}} bg="#fafafb">
        <Box mb="md">
          <Title order={1}>{product?.title}</Title>
        </Box>

        <TreatmentStepper paths={paths} />
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
