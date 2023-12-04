import {
  Outlet,
  useLoaderData,
  useLocation,
  useNavigate,
  type MetaFunction,
} from '@remix-run/react';
import {json, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
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
import {PRODUCT_SELECTED_OPTIONS_QUERY} from '~/data/queries';
import {determineStepFromURL} from '~/lib/determineStepFromURL';

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

const paths = [
  {
    title: 'Beskrivelse',
    path: '',
  },
  {
    title: 'Skønhedsekspert?',
    path: 'pick-username',
  },
  {
    title: 'Lokation?',
    path: 'pick-location',
  },
  {
    title: 'Andre behandlinger?',
    path: 'pick-more',
  },
  {
    title: 'Dato & Tid?',
    path: 'pick-datetime',
  },
  {
    title: 'Godkend',
    path: 'completed',
  },
];

function ProductMain({product}: {product: ProductFragment}) {
  const navigate = useNavigate();
  const location = useLocation();

  const [active, setActive] = useState(
    determineStepFromURL(paths, location.pathname),
  );

  const nextStep = () => {
    const newActive = active < 5 ? active + 1 : active;
    setActive(newActive);
    navigate(paths[newActive].path + location.search);
  };

  const prevStep = () => {
    const newActive = active > 0 ? active - 1 : active;
    setActive(newActive);
    navigate(paths[newActive].path + location.search);
  };

  return (
    <Box p={{base: rem(10), md: rem(42)}} bg="#fafafb">
      <Title order={1} size={rem(54)} mb="xl">
        {product?.title}
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
        {paths[active].path !== 'completed' && (
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
        )}
      </Group>

      <Box mt="xl">
        {paths[active].path === 'completed' ||
        paths[active].path === 'pick-datetime' ? (
          <Outlet context={{product}} />
        ) : (
          <ScrollArea
            style={{height: 'calc(100vh)'}}
            type="always"
            offsetScrollbars
            scrollbarSize={18}
          >
            <Outlet context={{product}} />
          </ScrollArea>
        )}
      </Box>
    </Box>
  );
}
