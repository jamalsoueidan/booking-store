import {Stack, Stepper} from '@mantine/core';
import {useLoaderData} from '@remix-run/react';
import {
  json,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
} from '@shopify/remix-oxygen';

export function action({context, request}: ActionFunctionArgs) {
  return json({});
}

export async function loader({params, request}: LoaderFunctionArgs) {
  const {productHandle, username, locationId} = params;

  const url = new URL(request.url);
  const productIds = url.searchParams.getAll('productIds');

  if (productIds.length === 0) {
    throw new Error('Expected productId to be selected');
  }

  if (!productHandle || !username || !locationId) {
    throw new Error('Expected product handle to be defined');
  }
  return json({});
}

export default function ArtistTreatmentsBooking() {
  const data = useLoaderData<typeof loader>();

  return (
    <Stack gap="xl">
      <Stepper color="pink" active={3}>
        <Stepper.Step
          label="Lokation"
          description="Hvor skal behandling ske?"
        ></Stepper.Step>
        <Stepper.Step
          label="Behandlinger"
          description="Hvilken behandlinger skal laves?"
        ></Stepper.Step>
        <Stepper.Step
          label="Dato & Tid"
          description="Hvornår skal behandling ske?"
        ></Stepper.Step>
        <Stepper.Completed>hej med dig</Stepper.Completed>
      </Stepper>
    </Stack>
  );
}
