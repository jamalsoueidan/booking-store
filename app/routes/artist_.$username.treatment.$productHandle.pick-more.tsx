import {
  Anchor,
  Box,
  Button,
  Divider,
  Flex,
  Group,
  Image,
  SimpleGrid,
  Text,
  Title,
  rem,
} from '@mantine/core';
import {Link, Outlet, useLoaderData, useSearchParams} from '@remix-run/react';
import {json, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {type ArtistTreatmentProductFragment} from 'storefrontapi.generated';

import {Image as ShopifyImage, parseGid} from '@shopify/hydrogen';

import {ArtistServiceCheckboxCard} from '~/components/artist/ArtistServiceCheckboxCard';
import {PriceBadge} from '~/components/artist/PriceBadge';
import {ArtistShell} from '~/components/ArtistShell';
import {TreatmentStepper} from '~/components/TreatmentStepper';
import {ArtistCollection} from '~/graphql/artist/ArtistCollection';
import {ArtistTreatment} from '~/graphql/artist/ArtistTreatment';
import {durationToTime} from '~/lib/duration';

export function shouldRevalidate() {
  return false;
}

export async function loader({params, request, context}: LoaderFunctionArgs) {
  const {productHandle, username} = params;
  const {storefront} = context;
  const {searchParams} = new URL(request.url);
  const locationId = searchParams.get('locationId') as string;

  if (!productHandle || !username || !locationId) {
    throw new Error('Expected product handle to be defined');
  }

  const {product} = await storefront.query(ArtistTreatment, {
    variables: {
      productHandle,
      country: storefront.i18n.country,
      language: storefront.i18n.language,
    },
  });

  if (!product) {
    throw new Response('Product handle is wrong', {
      status: 404,
    });
  }

  const {collection} = await context.storefront.query(ArtistCollection, {
    variables: {
      handle: username,
      filters: [
        {tag: 'treatments'},
        {tag: `locationid-${locationId}`},
        {tag: `scheduleid-${product.scheduleId?.value}`},
        {
          productMetafield: {
            namespace: 'booking',
            key: 'hide_from_combine',
            value: 'false',
          },
        },
      ],
      country: context.storefront.i18n.country,
      language: context.storefront.i18n.language,
    },
  });

  if (!collection?.products) {
    throw new Response('Collection graphql is wrong', {
      status: 404,
    });
  }

  // remove the product that are currently getting booked from the combine treatments.
  const products = collection.products.nodes.filter((p) => p.id !== product.id);

  return json({
    products,
  });
}

export default function ArtistTreatments() {
  const {products} = useLoaderData<typeof loader>();
  const [searchParams] = useSearchParams();

  const haveSelectedProducts = searchParams.getAll('productIds').length > 0;

  return (
    <>
      <ArtistShell.Main>
        {products?.length > 0 ? (
          <RenderArtistProducts products={products} />
        ) : (
          <>
            <Title order={4} fw="400">
              Den behandling, du har valgt, kan ikke kombineres med andre
              behandlinger. Tryk på{' '}
              <Anchor
                component={Link}
                to={`../pick-datetime?${searchParams.toString()}`}
                relative="route"
              >
                Næste
              </Anchor>{' '}
              for at fortsætte med din booking.
            </Title>
          </>
        )}

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
            {products?.length > 0
              ? haveSelectedProducts
                ? 'Ja tak'
                : 'Nej tak'
              : 'Næste'}
          </Button>
        </TreatmentStepper>
      </ArtistShell.Footer>
    </>
  );
}

type RenderArtistProductsProps = {
  products: ArtistTreatmentProductFragment[];
};

function RenderArtistProducts({products}: RenderArtistProductsProps) {
  return (
    <>
      <Title order={4} mb="sm" fw={600} size="md">
        Vælg gerne flere behandlinger:
      </Title>
      <SimpleGrid cols={1} spacing="lg">
        {products.map((product) => (
          <ArtistServiceProduct key={product.id} product={product} />
        ))}
      </SimpleGrid>
    </>
  );
}

type ArtistServiceProductProps = {
  product: ArtistTreatmentProductFragment;
};

function ArtistServiceProduct({product}: ArtistServiceProductProps) {
  const [searchParams, setSearchParams] = useSearchParams();

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
      prev.append('modal', product.handle || '');
      return prev;
    });
  };

  const leftSection = (
    <Text c="dimmed" fz="sm" tt="uppercase" fw={700}>
      {durationToTime(product.duration?.value ?? 0)}
    </Text>
  );

  const rightSection = product.variants.nodes[0].price && (
    <PriceBadge
      variant="light"
      color="gray"
      size="lg"
      compareAtPrice={product.variants.nodes[0].compareAtPrice}
      price={product.variants.nodes[0].price}
    />
  );

  return (
    <ArtistServiceCheckboxCard
      value={parseGid(product!.id).id}
      onClick={product?.options?.value ? onClickOptions : onClick}
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
              <Text
                c="dimmed"
                size="sm"
                fw={400}
                lineClamp={3}
                dangerouslySetInnerHTML={{__html: product.descriptionHtml}}
              ></Text>
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
