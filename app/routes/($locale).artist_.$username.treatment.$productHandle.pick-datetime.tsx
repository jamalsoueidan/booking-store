import {Group, Skeleton} from '@mantine/core';
import {
  Await,
  useLoaderData,
  type ShouldRevalidateFunctionArgs,
} from '@remix-run/react';
import {parseGid} from '@shopify/hydrogen';
import {defer, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {Suspense} from 'react';
import TreatmentPickDatetime from '~/components/TreatmentPickDatatime';
import {PRODUCT_SELECTED_OPTIONS_QUERY} from '~/data/queries';
import {getBookingShopifyApi} from '~/lib/api/bookingShopifyApi';

export function shouldRevalidate({
  currentUrl,
  nextUrl,
}: ShouldRevalidateFunctionArgs) {
  const currentSearchParams = currentUrl.searchParams;
  const nextSearchParams = nextUrl.searchParams;

  const currentParamsCopy = new URLSearchParams(currentSearchParams);
  const nextParamsCopy = new URLSearchParams(nextSearchParams);

  currentParamsCopy.delete('date');
  currentParamsCopy.delete('fromDate');
  currentParamsCopy.delete('toDate');
  nextParamsCopy.delete('date');
  nextParamsCopy.delete('fromDate');
  nextParamsCopy.delete('toDate');

  return currentParamsCopy.toString() !== nextParamsCopy.toString();
}

export async function loader({params, request, context}: LoaderFunctionArgs) {
  const {productHandle, username} = params;
  const {storefront} = context;
  const url = new URL(request.url);
  const searchParams = url.searchParams;

  const productIds = searchParams.getAll('productIds');
  const locationId = searchParams.get('locationId') as string | undefined;
  const shippingId = searchParams.get('shippingId') as string | undefined;

  if (!username || !productHandle || !locationId) {
    throw new Response('Expected artist handle to be defined', {status: 400});
  }

  const {product} = await storefront.query(PRODUCT_SELECTED_OPTIONS_QUERY, {
    variables: {productHandle, selectedOptions: []},
  });

  if (!product?.id) {
    throw new Response('Expected product handle to be defined', {status: 404});
  }

  const availability = getBookingShopifyApi().userAvailabilityGenerate(
    username,
    locationId,
    {
      productIds: [parseGid(product.id).id, ...productIds],
      fromDate: '2023-05-13',
      shippingId: shippingId ? shippingId : undefined, //stringify ignore undefined values but not NULL
    },
  );

  return defer({availability});
}

export default function ArtistTreatmentPickDatetime() {
  const {availability} = useLoaderData<typeof loader>();

  return (
    <Suspense
      fallback={
        <Group gap="md">
          <Skeleton height={20} />
          <Skeleton height={20} />
          <Skeleton height={20} />
        </Group>
      }
    >
      <Await resolve={availability}>
        {({payload}) => <TreatmentPickDatetime availability={payload} />}
      </Await>
    </Suspense>
  );
}
