import {
  Outlet,
  useLoaderData,
  useLocation,
  useNavigate,
  type MetaFunction,
} from '@remix-run/react';
import {defer, redirect, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import type {
  ProductFragment,
  ProductVariantFragment,
} from 'storefrontapi.generated';

import {
  ActionIcon,
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
import {IconArrowLeft, IconArrowRight} from '@tabler/icons-react';
import {useState} from 'react';
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

const paths: Record<number, {title: string; path: string}> = {
  0: {
    title: 'Beskrivelse',
    path: '',
  },
  1: {
    title: 'Skønhedsekspert',
    path: 'pick-artist',
  },
  2: {
    title: 'Lokation',
    path: 'pick-location',
  },
};

function ProductMain({product}: {product: ProductFragment}) {
  const navigate = useNavigate();
  const location = useLocation();
  const {title} = product;
  const [active, setActive] = useState(determineStepFromURL(location.pathname));

  function getBasePath() {
    const segments = location.pathname.split('/').filter(Boolean);
    return '/' + segments.slice(0, 2).join('/');
  }

  function determineStepFromURL(pathname: string) {
    const base = getBasePath();
    for (const [step, data] of Object.entries(paths)) {
      if (data.path !== '') {
        const fullPath = `${base}/${data.path}`.replace(/\/+$/, '');
        if (pathname === fullPath || pathname.startsWith(fullPath + '/')) {
          return parseInt(step, 10);
        }
      }
    }
    return 0;
  }

  const nextStep = () => {
    const newActive = active < 2 ? active + 1 : active;
    setActive(newActive);
    const basePath = getBasePath();
    navigate(`${basePath}/${paths[newActive].path}${location.search}`);
  };

  const prevStep = () => {
    const newActive = active > 0 ? active - 1 : active;
    setActive(newActive);
    const basePath = getBasePath();
    navigate(`${basePath}/${paths[newActive].path}${location.search}`);
  };

  return (
    <Box p={{base: rem(10), md: rem(42)}} bg="#fafafb">
      <Title order={1} size={rem(54)} mb="xl">
        {title}
      </Title>

      <Group justify="space-between">
        <Group gap="xs">
          <Text c="dimmed" size={rem(24)}>
            {active + 1}/{Object.keys(paths).length}
          </Text>
          <Text fw={500} tt="uppercase" size={rem(24)}>
            {paths[active].title}
          </Text>
        </Group>
        <Group gap="xs">
          {active > 0 ? (
            <>
              <ActionIcon
                variant="filled"
                color="yellow"
                c="black"
                radius="xl"
                size="xl"
                aria-label="Tilbage"
                onClick={prevStep}
              >
                <IconArrowLeft
                  style={{width: '70%', height: '70%'}}
                  stroke={1.5}
                />
              </ActionIcon>

              <ActionIcon
                variant="filled"
                color="yellow"
                c="black"
                radius="xl"
                size="xl"
                aria-label="Næste"
                onClick={nextStep}
              >
                <IconArrowRight
                  style={{width: '70%', height: '70%'}}
                  stroke={1.5}
                />
              </ActionIcon>
            </>
          ) : (
            <Button
              variant="filled"
              color="yellow"
              c="black"
              radius="xl"
              size="md"
              rightSection={<IconArrowRight />}
              onClick={nextStep}
            >
              Bestil en tid
            </Button>
          )}
        </Group>
      </Group>

      <ScrollArea
        h="500"
        type="always"
        offsetScrollbars
        scrollbarSize={18}
        mt="lg"
      >
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

export const PRODUCT_QUERY = `#graphql
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
