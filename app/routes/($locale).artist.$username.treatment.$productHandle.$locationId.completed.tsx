import {useLoaderData} from '@remix-run/react';
import {
  json,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
} from '@shopify/remix-oxygen';
import {ArtistStepper} from '~/components/artist/ArtistStepper';

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
    <ArtistStepper
      active={3}
      title="Færdig"
      description="Køb processen er færdig."
    >
      <>completed</>
    </ArtistStepper>
  );
}
