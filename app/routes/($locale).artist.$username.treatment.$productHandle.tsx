import {Outlet} from '@remix-run/react';
import {
  json,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
} from '@shopify/remix-oxygen';

export async function action({request}: ActionFunctionArgs) {
  return json({});
}

export async function loader({params}: LoaderFunctionArgs) {
  const {productHandle, username} = params;

  if (!productHandle || !username) {
    throw new Error('Expected product handle to be defined');
  }

  return json({});
}

export default function ArtistTreatments() {
  return <Outlet />;
}
