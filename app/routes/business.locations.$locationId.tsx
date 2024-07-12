import {Form, Link, Outlet, useLoaderData} from '@remix-run/react';

import {json, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {getBookingShopifyApi} from '~/lib/api/bookingShopifyApi';
import {getCustomer} from '~/lib/get-customer';

import {Button, Container, rem} from '@mantine/core';
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

  return json(response.payload);
}

export default function AccountLocationsEdit() {
  const defaultValue = useLoaderData<typeof loader>();

  return (
    <Container size="md" my={{base: rem(80), sm: rem(100)}}>
      <AccountTitle linkBack="/business/locations" heading={defaultValue.name}>
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
    </Container>
  );
}
