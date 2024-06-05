import {Outlet, useOutletContext} from '@remix-run/react';
import type {CustomerFragment} from 'customer-accountapi.generated';

export default function Addresses() {
  const {customer} = useOutletContext<{customer: CustomerFragment}>();

  return <Outlet context={{customer}} />;
}
