import {
  AspectRatio,
  Button,
  Flex,
  Group,
  SimpleGrid,
  Skeleton,
  Text,
  Title,
  rem,
} from '@mantine/core';
import {
  Await,
  useLoaderData,
  useNavigate,
  useParams,
  useSearchParams,
} from '@remix-run/react';
import {Image, Money, parseGid} from '@shopify/hydrogen';
import {defer, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {Suspense} from 'react';
import {
  type AccountServicesProductsQuery,
  type ArtistServicesProductsQuery,
} from 'storefrontapi.generated';
import {getBookingShopifyApi} from '~/lib/api/bookingShopifyApi';
import {
  type CustomerProductBase,
  type CustomerProductList,
} from '~/lib/api/model';
import {ALL_PRODUCTS_QUERY} from './($locale).artist.$username._index';

import {ArtistServiceCheckboxCard} from '~/components/artist/ArtistServiceCheckboxCard';
import {ArtistStepper} from '~/components/artist/ArtistStepper';
import {durationToTime} from '~/lib/duration';

export async function loader({params, context}: LoaderFunctionArgs) {
  const {productHandle, username, locationId} = params;

  if (!productHandle || !username || !locationId) {
    throw new Error('Expected product handle to be defined');
  }

  const productId = productHandle.match(/\d+$/)![0];

  const {payload: services} =
    await getBookingShopifyApi().userProductsListByLocation(
      username,
      productId,
      locationId,
    );

  const productIds = services.map(({productId}) => productId);

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
    selectedProductId: productId,
  });
}

export default function ArtistTreatments() {
  const {products, services, selectedProductId} =
    useLoaderData<typeof loader>();

  const params = useParams();
  const [searchParams] = useSearchParams();

  const shippingId = searchParams.get('shippingId');

  return (
    <ArtistStepper
      active={1}
      title="Behandlinger"
      description="Vælge behandlinger?"
    >
      <Suspense
        fallback={
          <SimpleGrid cols={{base: 1, lg: 4, md: 3, sm: 2}} spacing="xl">
            <Skeleton height={50} circle mb="xl" />
            <Skeleton height={8} radius="xl" />
          </SimpleGrid>
        }
      >
        <Await resolve={products}>
          {({products}) => (
            <form
              method="get"
              action={`${params.locationId}/availability`}
              style={{maxWidth: '100%'}}
            >
              {shippingId ? (
                <input type="hidden" name="shippingId" value={shippingId} />
              ) : null}

              <RenderArtistProducts
                products={products}
                services={services}
                selectedProductId={selectedProductId}
              />
            </form>
          )}
        </Await>
      </Suspense>
    </ArtistStepper>
  );
}

type RenderArtistProductsProps = {
  products: ArtistServicesProductsQuery['products'];
  services: CustomerProductBase[];
  selectedProductId: string;
};

function RenderArtistProducts({
  products,
  services,
  selectedProductId,
}: RenderArtistProductsProps) {
  const navigate = useNavigate();

  const handleCloseClick = (event: any) => {
    event.preventDefault();
    navigate(-1);
  };

  const selectedProduct = products.nodes.filter(
    (product) => parseGid(product.id).id === selectedProductId,
  );

  const selectedProductMarkup = (
    <ArtistProduct
      product={selectedProduct[0]}
      services={services as any}
      defaultChecked={true}
    />
  );

  const restProductsMarkup = products.nodes
    .filter((product) => parseGid(product.id).id !== selectedProductId)
    .map((product) => (
      <ArtistProduct
        key={product.id}
        product={product}
        services={services as any}
      />
    ));

  return (
    <>
      <Flex justify={'center'} align={'center'}>
        <SimpleGrid
          cols={{base: 1, md: 3}}
          spacing="lg"
          mb="md"
          p="lg"
          w={{base: '100%', md: '70%'}}
        >
          {selectedProductMarkup}
          {restProductsMarkup}
        </SimpleGrid>
      </Flex>
      <Group justify="center">
        <Button onClick={handleCloseClick}>Tilbage</Button>
        <Button type="submit">Næste</Button>
      </Group>
    </>
  );
}

type ArtistProductProps = {
  product: AccountServicesProductsQuery['products']['nodes'][number];
  services: CustomerProductList[];
  defaultChecked?: boolean;
};

function ArtistProduct({
  product,
  services,
  defaultChecked,
}: ArtistProductProps) {
  const artistService = services.find(({productId}) => {
    return productId.toString() === parseGid(product.id).id;
  });

  const productVariant = product.variants.nodes.find(({id}) => {
    return parseGid(id).id === artistService?.variantId.toString();
  });

  return (
    <ArtistServiceCheckboxCard
      value={artistService!.productId.toString()}
      defaultChecked={defaultChecked}
      name="productIds"
    >
      <AspectRatio ratio={1920 / 1080}>
        <Image
          data={product.images.nodes[0]}
          aspectRatio="1/1"
          sizes="(min-width: 45em) 20vw, 50vw"
        />
      </AspectRatio>
      <Title order={3} mt="sm" size={'md'} mb={rem(4)}>
        {product.title}
      </Title>
      <Text c="dimmed" size="xs" tt="uppercase" fw={500}>
        {artistService?.description || 'ingen beskrivelse'}
      </Text>

      <Flex
        gap="sm"
        mt="lg"
        direction="column"
        justify="flex-end"
        style={{flexGrow: 1, position: 'relative'}}
      >
        <Group justify="space-between" mt="md">
          <Text c="dimmed" size="xs" tt="uppercase" fw={700}>
            {durationToTime(artistService?.duration ?? 0)}
          </Text>

          {productVariant ? (
            <Text c="black" size="xs" tt="uppercase" fw={700}>
              <Money data={productVariant.price} />
            </Text>
          ) : null}
        </Group>
      </Flex>
    </ArtistServiceCheckboxCard>
  );
}
