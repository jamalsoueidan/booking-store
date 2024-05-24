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
import {
  Link,
  Outlet,
  useLoaderData,
  useOutletContext,
  useSearchParams,
} from '@remix-run/react';
import {json, type LoaderFunctionArgs} from '@shopify/remix-oxygen';

import {parseGid} from '@shopify/hydrogen';

import {useMemo} from 'react';
import {type PickMoreTreatmentProductFragment} from 'storefrontapi.generated';
import {ArtistServiceCheckboxCard} from '~/components/artist/ArtistServiceCheckboxCard';
import {PriceBadge} from '~/components/artist/PriceBadge';
import {ArtistShell} from '~/components/ArtistShell';
import {TreatmentStepper} from '~/components/TreatmentStepper';
import {TREATMENT_OPTION_FRAGMENT} from '~/graphql/fragments/TreatmentOption';
import {durationToTime} from '~/lib/duration';
import {parseOptionsFromQuery} from '~/lib/parseOptionsQueryParameters';
import {type OutletLoader} from './artist_.$username.treatment.$productHandle';

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

  const {product} = await storefront.query(GET_PRODUCT_SCHEDULE_ID, {
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

  const {collection} = await context.storefront.query(PICK_MORE_PRODUCTS, {
    variables: {
      handle: username,
      filters: [
        {tag: 'treatments'},
        {tag: `locationid-${locationId}`},
        {tag: `scheduleid-${product.scheduleId?.reference?.handle}`},
        {
          productMetafield: {
            namespace: 'booking',
            key: 'hide_from_combine',
            value: 'False',
          },
        },
      ],
      country: context.storefront.i18n.country,
      language: context.storefront.i18n.language,
    },
    cache: context.storefront.CacheShort(),
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
  const {totalPrice, totalDuration} = useOutletContext<OutletLoader>();
  const selectedProductsIds = searchParams.getAll('productIds');

  const selectedProducts = useMemo(
    () =>
      products.filter((p) =>
        selectedProductsIds.some((sp) => sp === parseGid(p.id).id),
      ),
    [products, selectedProductsIds],
  );

  const optionsFromQuery: Record<string, Record<string, string>> = useMemo(
    () => parseOptionsFromQuery(searchParams),
    [searchParams],
  );

  const moreSummary = selectedProducts.reduce(
    (summary, product) => {
      const productId = parseGid(product.id).id;
      const productOptions = optionsFromQuery[productId];
      const productPrice = parseInt(product.variants.nodes[0].price.amount);
      const productDuration = parseInt(product.duration?.value || '');

      const variantSummary = product.options?.references?.nodes
        .filter((p) => productOptions[parseGid(p.id).id])
        .reduce(
          (summary, product) => {
            const productId = parseGid(product.id).id;
            const variantId = productOptions[productId];
            const variant = product.variants.nodes.find(
              (p) => parseGid(p.id).id === variantId,
            );

            const variantPrice = parseInt(variant?.price.amount || '');
            const variantDuration = parseInt(variant?.duration?.value || '');
            return {
              price: summary.price + variantPrice,
              duration: summary.duration + variantDuration,
            };
          },
          {
            price: 0,
            duration: 0,
          },
        ) || {price: 0, duration: 0};

      return {
        price: summary.price + productPrice + variantSummary.price,
        duration: summary.duration + productDuration + variantSummary.duration,
      };
    },
    {price: 0, duration: 0},
  );

  return (
    <>
      <ArtistShell.Main>
        <Flex direction="column" justify="center" mb="lg">
          <Title order={2} fw={600} fz={{base: 'h2'}} ta="center">
            Tilvalg
          </Title>

          {products?.length > 0 ? (
            <Text c="dimmed" ta="center">
              Du har mulighed for at kombinere behandling med andre og eventuel
              spar penge!
            </Text>
          ) : (
            <Text c="dimmed" ta="center">
              Den behandling, du har valgt, kan ikke kombineres med andre
              behandlinger.
              <br /> Tryk på{' '}
              <Anchor
                component={Link}
                to={`../pick-datetime?${searchParams.toString()}`}
                relative="route"
              >
                Næste
              </Anchor>{' '}
              for at fortsætte med din booking.
            </Text>
          )}
        </Flex>
        {products?.length > 0 ? (
          <RenderArtistProducts products={products} />
        ) : null}

        <Outlet />
      </ArtistShell.Main>
      <ArtistShell.Footer>
        <TreatmentStepper
          totalPrice={totalPrice + moreSummary.price}
          totalDuration={totalDuration + moreSummary.duration}
        >
          <Button
            variant="default"
            component={Link}
            to={`../pick-datetime?${searchParams.toString()}`}
            relative="route"
            prefetch="intent"
          >
            {products?.length > 0
              ? selectedProductsIds.length > 0
                ? 'Ja tak'
                : 'Nej tak'
              : 'Næste'}
          </Button>
        </TreatmentStepper>
      </ArtistShell.Footer>
    </>
  );
}

function RenderArtistProducts({
  products,
}: {
  products: PickMoreTreatmentProductFragment[];
}) {
  return (
    <SimpleGrid cols={1} spacing="lg">
      {products.map((product) => (
        <ArtistServiceProduct key={product.id} product={product} />
      ))}
    </SimpleGrid>
  );
}

function ArtistServiceProduct({
  product,
}: {
  product: PickMoreTreatmentProductFragment;
}) {
  const [searchParams, setSearchParams] = useSearchParams();

  const productID = parseGid(product.id).id;
  const isChecked = searchParams.getAll('productIds').includes(productID);

  const onClick = () => {
    setSearchParams(
      (prev) => {
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
      },
      {preventScrollReset: true, replace: true},
    );
  };

  const onClickOptions = () => {
    setSearchParams(
      (prev) => {
        prev.append('modal', product.handle || '');
        return prev;
      },
      {preventScrollReset: true, replace: true},
    );
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
            src={product.featuredImage.url}
            h="auto"
            w="25%"
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

export const GET_PRODUCT_SCHEDULE_ID = `#graphql
  query GetProductScheduleId(
    $productHandle: String!
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    product(handle: $productHandle) {
      id
      scheduleId: metafield(key: "scheduleId", namespace: "booking") {
        reference {
          ... on Metaobject {
            handle
          }
        }
      }
    }
  }
` as const;

export const PICK_MORE_TREATMENT_PRODUCT = `#graphql
  ${TREATMENT_OPTION_FRAGMENT}
  fragment PickMoreTreatmentProduct on Product {
    id
    title
    descriptionHtml
    productType
    handle
    featuredImage {
      id
      altText
      url(transform: { maxHeight: 250, maxWidth: 250, crop: CENTER })
      width
      height
    }
    variants(first: 1) {
      nodes {
        compareAtPrice {
          amount
          currencyCode
        }
        price {
          amount
          currencyCode
        }
      }
    }
    options: metafield(key: "options", namespace: "booking") {
      value
      references(first: 10) {
        nodes {
          ...TreatmentOption
        }
      }
    }
    duration: metafield(key: "duration", namespace: "booking") {
      id
      value
    }
  }
` as const;

export const PICK_MORE_PRODUCTS = `#graphql
  ${PICK_MORE_TREATMENT_PRODUCT}

  query PickMoreProducts(
    $handle: String!
    $country: CountryCode
    $language: LanguageCode
    $filters: [ProductFilter!] = {}
  ) @inContext(country: $country, language: $language) {
    collection(handle: $handle) {
      products(first: 20, sortKey: TITLE, filters: $filters) {
        nodes {
          ...PickMoreTreatmentProduct
        }
      }
    }
  }
` as const;
