import {Card, Text} from '@mantine/core';
import {useActionData, useLoaderData} from '@remix-run/react';
import {
  json,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
} from '@shopify/remix-oxygen';
import {type ArtistServicesProductsQuery} from 'storefrontapi.generated';
import {ArtistStepper} from '~/components/artist/ArtistStepper';
import {getBookingShopifyApi} from '~/lib/api/bookingShopifyApi';
import {type CustomerProductBase} from '~/lib/api/model';
import {ALL_PRODUCTS_QUERY} from './($locale).artist.$username._index';

type ActionResult = {
  date: string;
  slot: string;
  products: ArtistServicesProductsQuery['products'];
  services: CustomerProductBase[];
};

export async function action({context, params, request}: ActionFunctionArgs) {
  const {productHandle, username, locationId} = params;

  const url = new URL(request.url);
  const productIds = url.searchParams.getAll('productIds');

  if (productIds.length === 0) {
    throw new Error('Expected productId to be selected');
  }

  if (!productHandle || !username || !locationId) {
    throw new Error('Expected product handle to be defined');
  }

  const formData = await request.formData();
  const date = formData.get('date') as string;
  const slot = formData.get('slot') as string;

  const {payload: location} = await getBookingShopifyApi().userLocationGet(
    username,
    locationId,
  );

  const {payload: services} =
    await getBookingShopifyApi().userProductsGetProducts(username, locationId, {
      productIds,
    });

  const {products} = await context.storefront.query(ALL_PRODUCTS_QUERY, {
    variables: {
      first: productIds.length,
      query: productIds.length > 0 ? productIds.join(' OR ') : 'id=-',
      country: context.storefront.i18n.country,
      language: context.storefront.i18n.language,
    },
  });

  return json({date, slot, location, products, services});
}

export async function loader({params, request}: LoaderFunctionArgs) {
  return json({});
}

export default function ArtistTreatmentsBooking() {
  const action = useActionData<ActionResult>();
  const data = useLoaderData<typeof loader>();

  console.log(action);

  return (
    <ArtistStepper
      active={3}
      title="Færdig"
      description="Køb processen er færdig."
    >
      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Card.Section>
          <Text fw={500}>Norway Fjord Adventures</Text>
        </Card.Section>
      </Card>
    </ArtistStepper>
  );
}
