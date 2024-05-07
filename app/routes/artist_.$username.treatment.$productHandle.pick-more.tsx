import {
  Badge,
  Box,
  Button,
  Divider,
  Flex,
  Group,
  Image,
  SimpleGrid,
  Skeleton,
  Text,
  Title,
  rem,
} from '@mantine/core';
import {
  Await,
  Link,
  Outlet,
  useLoaderData,
  useSearchParams,
} from '@remix-run/react';
import {defer, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {Suspense} from 'react';
import {type ProductItemFragment} from 'storefrontapi.generated';
import {getBookingShopifyApi} from '~/lib/api/bookingShopifyApi';
import {type CustomerProductBase} from '~/lib/api/model';
import {ALL_PRODUCTS_QUERY} from './artist.$username._index';

import {Money, Image as ShopifyImage, parseGid} from '@shopify/hydrogen';

import {ArtistServiceCheckboxCard} from '~/components/artist/ArtistServiceCheckboxCard';
import {ArtistShell} from '~/components/ArtistShell';
import {TreatmentStepper} from '~/components/TreatmentStepper';
import {durationToTime} from '~/lib/duration';

export function shouldRevalidate() {
  return false;
}

export async function loader({params, request, context}: LoaderFunctionArgs) {
  const {productHandle, username} = params;
  const {searchParams} = new URL(request.url);
  const locationId = searchParams.get('locationId') as string;

  if (!productHandle || !username || !locationId) {
    throw new Error('Expected product handle to be defined');
  }

  const {payload: services} =
    await getBookingShopifyApi().userProductsListByLocation(
      username,
      productHandle,
      locationId,
    );

  const productIds = services
    .filter((product) => product.productHandle !== productHandle)
    .map(({productId}) => productId);

  const products = context.storefront.query(ALL_PRODUCTS_QUERY, {
    variables: {
      first: productIds.length,
      query: productIds.length > 0 ? productIds.join(' OR ') : 'id=-',
      country: context.storefront.i18n.country,
      language: context.storefront.i18n.language,
    },
  });

  return defer({
    products,
    services,
  });
}

export default function ArtistTreatments() {
  const {products, services} = useLoaderData<typeof loader>();
  const [searchParams] = useSearchParams();

  const haveSelectedProducts = searchParams.getAll('productIds').length > 0;

  return (
    <>
      <ArtistShell.Main>
        <Suspense
          fallback={
            <SimpleGrid cols={{base: 1}} spacing="xl">
              <Skeleton height={50} width="100%" circle mb="xl" />
              <Skeleton height={50} width="100%" radius="xl" />
            </SimpleGrid>
          }
        >
          <Await resolve={products}>
            {({products}) => {
              if (products.nodes.length > 0) {
                return (
                  <RenderArtistProducts
                    products={products.nodes}
                    services={services}
                  />
                );
              } else {
                return (
                  <Text c="dimmed">
                    Ingen yderligere behandlinger tilgængelige. <br />
                    <strong>Tryk næste!</strong>
                  </Text>
                );
              }
            }}
          </Await>
        </Suspense>
        <Outlet />
      </ArtistShell.Main>
      <ArtistShell.Footer>
        <TreatmentStepper
          currentStep={2}
          totalSteps={3}
          pageTitle="Behandlinger"
        >
          <Button
            variant="default"
            component={Link}
            to={`../pick-datetime?${searchParams.toString()}`}
            relative="route"
          >
            {haveSelectedProducts ? 'Ja tak' : 'Nej tak'}
          </Button>
        </TreatmentStepper>
      </ArtistShell.Footer>
    </>
  );
}

type RenderArtistProductsProps = {
  products: ProductItemFragment[];
  services: CustomerProductBase[];
};

function RenderArtistProducts({products, services}: RenderArtistProductsProps) {
  return (
    <>
      <Title order={4} mb="sm" fw={600} size="md">
        Vælg gerne flere behandlinger:
      </Title>
      <SimpleGrid cols={1} spacing="lg">
        {products.map((product) => (
          <ArtistServiceProduct
            key={product.id}
            product={product}
            services={services}
          />
        ))}
      </SimpleGrid>
    </>
  );
}

type ArtistServiceProductProps = {
  product: ProductItemFragment;
  services: CustomerProductBase[];
};

function ArtistServiceProduct({product, services}: ArtistServiceProductProps) {
  const [searchParams, setSearchParams] = useSearchParams();

  const artistService = services.find(({productId}) => {
    return productId.toString() === parseGid(product.id).id;
  });

  const productID = parseGid(product.id).id;
  const isChecked = searchParams.getAll('productIds').includes(productID);

  const onClick = () => {
    setSearchParams((prev) => {
      const existingItems = prev.getAll('productIds');
      if (existingItems.includes(productID)) {
        prev.delete('productIds');
        existingItems.forEach((item) => {
          if (item !== productID) {
            prev.append('productIds', item);
          }
        });
      } else {
        prev.append('productIds', productID);
      }
      return prev;
    });
  };

  const onClickOptions = () => {
    setSearchParams((prev) => {
      prev.append('modal', artistService?.productHandle || '');
      return prev;
    });
  };

  const leftSection = (
    <Text c="dimmed" size="xs" tt="uppercase" fw={700}>
      {durationToTime(artistService?.duration ?? 0)}
    </Text>
  );

  const rightSection = artistService?.price && (
    <Badge variant="light" color="gray" size="md">
      <Money data={artistService?.price as any} />
    </Badge>
  );

  return (
    <ArtistServiceCheckboxCard
      value={artistService!.productId}
      onClick={
        artistService?.options && artistService.options.length > 0
          ? onClickOptions
          : onClick
      }
      isChecked={isChecked}
      name="productIds"
    >
      <Flex>
        {product.featuredImage && (
          <Image
            component={ShopifyImage}
            data={product.featuredImage}
            h="auto"
            loading="lazy"
            visibleFrom="sm"
          />
        )}
        <Flex direction="column" style={{flex: '1'}}>
          <Box p="xs" style={{flex: 1}}>
            <Title order={4} mb={rem(4)} fw={500}>
              {product.title}
            </Title>
            <Flex
              gap="sm"
              direction="column"
              justify="flex-start"
              style={{flexGrow: 1, position: 'relative'}}
            >
              <Text c="dimmed" size="sm" fw={400} lineClamp={3}>
                {artistService?.description ||
                  product.description ||
                  'ingen beskrivelse'}
              </Text>
            </Flex>
          </Box>

          <Divider />

          <Box p="xs">
            <Group justify="space-between">
              {leftSection}
              {rightSection}
            </Group>
          </Box>
        </Flex>
      </Flex>
    </ArtistServiceCheckboxCard>
  );
}
