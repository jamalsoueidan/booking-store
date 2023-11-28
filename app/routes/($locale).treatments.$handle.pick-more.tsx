import {Badge, Flex, SimpleGrid, Skeleton, Text} from '@mantine/core';
import {
  Await,
  useLoaderData,
  useNavigate,
  useSearchParams,
} from '@remix-run/react';
import {Money, parseGid} from '@shopify/hydrogen';
import {defer, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {Suspense} from 'react';
import {
  type ArtistServicesProductsQuery,
  type ProductServiceItemFragment,
} from 'storefrontapi.generated';
import {getBookingShopifyApi} from '~/lib/api/bookingShopifyApi';
import {type CustomerProductBase} from '~/lib/api/model';
import {ALL_PRODUCTS_QUERY} from './($locale).artist.$username._index';

import {ArtistServiceCheckboxCard} from '~/components/artist/ArtistServiceCheckboxCard';
import {TreatmentContent} from '~/components/treatment/TreatmentContent';
import {durationToTime} from '~/lib/duration';
import {PRODUCT_QUERY} from './($locale).treatments.$handle';

export async function loader({params, request, context}: LoaderFunctionArgs) {
  const {handle} = params;
  const {storefront} = context;

  if (!handle) {
    throw new Error('Expected product handle to be defined');
  }
  // await the query for the critical product data
  const {product} = await storefront.query(PRODUCT_QUERY, {
    variables: {handle, selectedOptions: []},
  });

  if (!product?.id) {
    throw new Response(null, {status: 404});
  }

  const {searchParams} = new URL(request.url);
  const locationId = searchParams.get('locationId') as string;
  const username = searchParams.get('username') as string;

  const productId = parseGid(product.id).id;

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

  const [searchParams] = useSearchParams();

  const shippingId = searchParams.get('shippingId');

  return (
    <Suspense
      fallback={
        <SimpleGrid cols={{base: 1}} spacing="xl">
          <Skeleton height={50} width="100%" circle mb="xl" />
          <Skeleton height={50} width="100%" radius="xl" />
        </SimpleGrid>
      }
    >
      <Await resolve={products}>
        {({products}) => (
          <RenderArtistProducts
            products={products}
            services={services}
            selectedProductId={selectedProductId}
          />
        )}
      </Await>
    </Suspense>
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

  const restProductsMarkup = products.nodes
    .filter((product) => parseGid(product.id).id !== selectedProductId)
    .map((product) => (
      <ArtistProduct key={product.id} product={product} services={services} />
    ));

  return (
    <>
      <Flex direction="row" justify={'center'} align={'center'}>
        <SimpleGrid cols={1} spacing="lg">
          {restProductsMarkup}
        </SimpleGrid>
      </Flex>
    </>
  );
}

type ArtistProductProps = {
  product: ProductServiceItemFragment;
  services: CustomerProductBase[];
  defaultChecked?: boolean;
};

function ArtistProduct({
  product,
  services,
  defaultChecked,
}: ArtistProductProps) {
  const [searchParams, setSearchParams] = useSearchParams();

  const onChange = (checked: boolean) => {
    const newSearchParams = new URLSearchParams(searchParams);

    const existingItems = newSearchParams.getAll('productIds');
    const itemIndex = existingItems.indexOf(parseGid(product.id).id);

    if (checked && itemIndex === -1) {
      newSearchParams.append('productIds', parseGid(product.id).id);
    }

    if (!checked) {
      const updatedItems = existingItems.filter(
        (item) => item !== parseGid(product.id).id,
      );
      newSearchParams.delete('productIds');
      updatedItems.forEach((item) =>
        newSearchParams.append('productIds', item),
      );
    }

    setSearchParams(newSearchParams);
  };

  const artistService = services.find(({productId}) => {
    return productId.toString() === parseGid(product.id).id;
  });

  const productVariant = product.variants.nodes.find(({id}) => {
    return parseGid(id).id === artistService?.variantId.toString();
  });

  const leftSection = (
    <Text c="dimmed" size="xs" tt="uppercase" fw={700}>
      {durationToTime(artistService?.duration ?? 0)}
    </Text>
  );

  const rightSection = productVariant?.price && (
    <Badge variant="light" color="gray" size="lg">
      <Money data={productVariant?.price} />
    </Badge>
  );

  return (
    <ArtistServiceCheckboxCard
      value={artistService!.productId.toString()}
      defaultChecked={defaultChecked}
      onChange={onChange}
      name="productIds"
    >
      <TreatmentContent
        product={product}
        description={artistService?.description}
        leftSection={leftSection}
        rightSection={rightSection}
      />
    </ArtistServiceCheckboxCard>
  );
}
