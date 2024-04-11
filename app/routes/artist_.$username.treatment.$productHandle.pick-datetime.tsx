import {Button, Flex, SimpleGrid, Skeleton, Stack} from '@mantine/core';
import {
  Await,
  Link,
  useLoaderData,
  useLocation,
  type ShouldRevalidateFunctionArgs,
} from '@remix-run/react';
import {parseGid} from '@shopify/hydrogen';
import {defer, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {Suspense} from 'react';
import {ArtistShell} from '~/components/ArtistShell';
import TreatmentPickDatetime from '~/components/TreatmentPickDatatime';
import {TreatmentStepper} from '~/components/TreatmentStepper';
import {PRODUCT_VALIDATE_HANDLER_QUERY} from '~/data/queries';
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
  const calendar = searchParams.get('calendar') || new Date().toJSON();
  const locationId = searchParams.get('locationId') as string | undefined;
  const shippingId = searchParams.get('shippingId') as string | undefined;

  if (!username || !productHandle || !locationId) {
    throw new Response('Expected artist handle to be defined', {status: 400});
  }

  const {product} = await storefront.query(PRODUCT_VALIDATE_HANDLER_QUERY, {
    variables: {productHandle},
  });

  if (!product?.id) {
    throw new Response('Expected product handle to be defined', {status: 404});
  }

  const availability = getBookingShopifyApi().userAvailabilityGenerate(
    username,
    locationId,
    {
      productIds: [parseGid(product.id).id, ...productIds],
      fromDate: calendar.substring(0, 10),
      shippingId: shippingId ? shippingId : undefined, //stringify ignore undefined values but not NULL
    },
  );

  return defer({availability});
}

export default function ArtistTreatmentPickDatetime() {
  const {availability} = useLoaderData<typeof loader>();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const isDisabled =
    !searchParams.has('fromDate') ||
    (searchParams.get('fromDate') === '' && !searchParams.has('toDate')) ||
    searchParams.get('toDate') === '';

  return (
    <>
      <ArtistShell.Main>
        <Suspense
          fallback={
            <Stack gap="lg">
              <SimpleGrid cols={2}>
                <Skeleton height={30} width="80%" />
                <Flex gap="lg" justify="flex-end">
                  <Skeleton height={30} width={30} />
                  <Skeleton height={30} width={30} />
                </Flex>
              </SimpleGrid>
              <Flex gap="lg">
                <Skeleton height={30} style={{flex: 1}} />
                <Skeleton height={30} style={{flex: 1}} />
                <Skeleton height={30} style={{flex: 1}} />
                <Skeleton height={30} style={{flex: 1}} />
                <Skeleton height={30} style={{flex: 1}} />
                <Skeleton height={30} style={{flex: 1}} />
                <Skeleton height={30} style={{flex: 1}} />
              </Flex>
            </Stack>
          }
        >
          <Await resolve={availability}>
            {({payload}) => <TreatmentPickDatetime availability={payload} />}
          </Await>
        </Suspense>
      </ArtistShell.Main>
      <ArtistShell.Footer>
        <TreatmentStepper
          currentStep={3}
          totalSteps={3}
          pageTitle="Tidsbestilling"
        >
          <Button
            variant="default"
            component={Link}
            to={`../completed${location.search}`}
            disabled={isDisabled}
          >
            Færdig
          </Button>
        </TreatmentStepper>
      </ArtistShell.Footer>
    </>
  );
}
