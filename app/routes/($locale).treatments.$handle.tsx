import {Link, Outlet, useLoaderData, type MetaFunction} from '@remix-run/react';
import {defer, redirect, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import type {
  ProductFragment,
  ProductVariantFragment,
} from 'storefrontapi.generated';

import {
  AspectRatio,
  Box,
  Button,
  Group,
  ScrollArea,
  SimpleGrid,
  Text,
  Title,
  rem,
} from '@mantine/core';
import {Image, getSelectedProductOptions} from '@shopify/hydrogen';
import {IconArrowRight} from '@tabler/icons-react';
import {getVariantUrlForTreatment} from '~/utils';

export const meta: MetaFunction<typeof loader> = ({data}) => {
  return [{title: `BySisters | ${data?.product.title ?? ''}`}];
};

export async function loader({params, request, context}: LoaderFunctionArgs) {
  const {handle} = params;
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

  if (!handle) {
    throw new Error('Expected product handle to be defined');
  }

  // await the query for the critical product data
  const {product} = await storefront.query(PRODUCT_QUERY, {
    variables: {handle, selectedOptions},
  });

  if (!product?.id) {
    throw new Response(null, {status: 404});
  }

  const firstVariant = product.variants.nodes[0];
  product.selectedVariant = firstVariant;

  return defer({product});
}

export default function Product() {
  const {product} = useLoaderData<typeof loader>();
  const {selectedVariant} = product;

  return (
    <SimpleGrid cols={{base: 1, md: 2}} spacing={0}>
      <ProductImage image={selectedVariant?.image} />
      <ProductMain product={product} />
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

function ProductMain({product}: {product: ProductFragment}) {
  const {title} = product;
  return (
    <Box p={rem(42)} bg="#fafafb">
      <Title order={1} size={rem(54)} mb="xl">
        {title}
      </Title>

      <Group justify="space-between">
        <Group>
          <Text c="dimmed" size={rem(24)}>
            1/4
          </Text>
          <Text fw={500} tt="uppercase" size={rem(24)}>
            Beskrivelse
          </Text>
        </Group>
        <Button
          variant="filled"
          color="yellow"
          c="black"
          radius="xl"
          size="md"
          rightSection={<IconArrowRight />}
          component={Link}
          to="./variants"
        >
          Bestil en tid
        </Button>
      </Group>

      <ScrollArea h="500" type="always" offsetScrollbars scrollbarSize={18}>
        <Outlet context={{product}} />
      </ScrollArea>
    </Box>
  );
}

function redirectToFirstVariant({
  product,
  request,
}: {
  product: ProductFragment;
  request: Request;
}) {
  const url = new URL(request.url);
  const firstVariant = product.variants.nodes[0];

  return redirect(
    getVariantUrlForTreatment({
      pathname: url.pathname,
      handle: product.handle,
      selectedOptions: firstVariant.selectedOptions,
      searchParams: new URLSearchParams(url.search),
    }),
    {
      status: 302,
    },
  );
}

const PRODUCT_VARIANT_FRAGMENT = `#graphql
  fragment ProductVariant on ProductVariant {
    availableForSale
    compareAtPrice {
      amount
      currencyCode
    }
    id
    image {
      __typename
      id
      url
      altText
      width
      height
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
    sku
    title
    unitPrice {
      amount
      currencyCode
    }
  }
` as const;

const PRODUCT_FRAGMENT = `#graphql
  fragment Product on Product {
    id
    title
    vendor
    handle
    descriptionHtml
    description
    options {
      name
      values
    }
    selectedVariant: variantBySelectedOptions(selectedOptions: $selectedOptions) {
      ...ProductVariant
    }
    variants(first: 1) {
      nodes {
        ...ProductVariant
      }
    }
    seo {
      description
      title
    }
  }
  ${PRODUCT_VARIANT_FRAGMENT}
` as const;

const PRODUCT_QUERY = `#graphql
  query Product(
    $country: CountryCode
    $handle: String!
    $language: LanguageCode
    $selectedOptions: [SelectedOptionInput!]!
  ) @inContext(country: $country, language: $language) {
    product(handle: $handle) {
      ...Product
    }
  }
  ${PRODUCT_FRAGMENT}
` as const;

const PRODUCT_VARIANTS_FRAGMENT = `#graphql
  fragment ProductVariants on Product {
    variants(first: 250) {
      nodes {
        ...ProductVariant
      }
    }
  }
  ${PRODUCT_VARIANT_FRAGMENT}
` as const;

const VARIANTS_QUERY = `#graphql
  ${PRODUCT_VARIANTS_FRAGMENT}
  query ProductVariants(
    $country: CountryCode
    $language: LanguageCode
    $handle: String!
  ) @inContext(country: $country, language: $language) {
    product(handle: $handle) {
      ...ProductVariants
    }
  }
` as const;
