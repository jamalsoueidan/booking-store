import {Flex, SimpleGrid, Skeleton} from '@mantine/core';
import {Await, useLoaderData, useParams} from '@remix-run/react';
import {defer, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {Suspense} from 'react';
import {type ProductItemFragment} from 'storefrontapi.generated';
import {getBookingShopifyApi} from '~/lib/api/bookingShopifyApi';
import {type CustomerProductBase} from '~/lib/api/model';
import {ALL_PRODUCTS_QUERY} from './($locale).artist.$username._index';

import {ArtistServiceProduct} from '~/components/artist/ArtistServiceProduct';

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
  });
}

export default function ArtistTreatments() {
  const {products, services} = useLoaderData<typeof loader>();
  const {productHandle: selectedProductHandle} = useParams();

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
            products={products.nodes}
            services={services}
            selectedProductHandle={selectedProductHandle || ''}
          />
        )}
      </Await>
    </Suspense>
  );
}

type RenderArtistProductsProps = {
  products: ProductItemFragment[];
  services: CustomerProductBase[];
  selectedProductHandle: string;
};

function RenderArtistProducts({
  products,
  services,
  selectedProductHandle,
}: RenderArtistProductsProps) {
  const restProductsMarkup = products
    .filter((product) => product.handle !== selectedProductHandle)
    .map((product) => (
      <ArtistServiceProduct
        key={product.id}
        product={product}
        services={services}
      />
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
