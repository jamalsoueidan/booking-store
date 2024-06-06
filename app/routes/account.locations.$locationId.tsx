import {Form, Link, Outlet, useLoaderData} from '@remix-run/react';

import {type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {getBookingShopifyApi} from '~/lib/api/bookingShopifyApi';
import {getCustomer} from '~/lib/get-customer';

import {Button} from '@mantine/core';
import {jsonWithSuccess} from 'remix-toast';
import {AccountButton} from '~/components/account/AccountButton';
import {AccountContent} from '~/components/account/AccountContent';
import {AccountTitle} from '~/components/account/AccountTitle';

export async function loader({context, params}: LoaderFunctionArgs) {
  const customerId = await getCustomer({context});

  const {locationId} = params;
  if (!locationId) {
    throw new Error('Missing scheduleHandle param');
  }

  const response = await getBookingShopifyApi().customerLocationGet(
    customerId,
    locationId,
    context,
  );

  return jsonWithSuccess(response.payload, {message: 'Location er opdateret!'});
}

export default function AccountLocationsEdit() {
  const defaultValue = useLoaderData<typeof loader>();

  return (
    <>
      <AccountTitle linkBack="/account/locations" heading={defaultValue.name}>
        <AccountButton to={'.'} data-testid="products-button">
          Basic detaljer
        </AccountButton>

        <AccountButton to={'products'} data-testid="products-button">
          Tilknyttet produkter
        </AccountButton>

        <Button
          variant="outline"
          radius="xl"
          color="black"
          fw="300"
          component={Link}
          to={`https://www.google.com/maps/search/?api=1&query=${defaultValue.geoLocation.coordinates
            .sort()
            .join(',')}`}
          target="_blank"
          rel="noreferrer"
        >
          Kortvisning
        </Button>

        <Form
          method="post"
          action={`../${defaultValue._id}/destroy`}
          style={{display: 'inline-block'}}
        >
          <Button
            variant="outline"
            radius="xl"
            color="red"
            type="submit"
            data-testid={`delete-button-${defaultValue._id}`}
          >
            Slet
          </Button>
        </Form>
      </AccountTitle>

      <AccountContent>
        <Outlet />
      </AccountContent>
    </>
  );
}
