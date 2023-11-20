import {Outlet} from '@remix-run/react';
import {json, type LoaderFunctionArgs} from '@shopify/remix-oxygen';

export async function loader({params}: LoaderFunctionArgs) {
  const {productHandle, username, locationId} = params;

  if (!productHandle || !username || !locationId) {
    throw new Error(
      'Expected username, productHandle, and locationId handle to be defined',
    );
  }
  return json({});
}

export default function ArtistTreatment() {
  return <Outlet />;
}
