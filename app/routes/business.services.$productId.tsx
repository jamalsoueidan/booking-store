import {Button, Container, rem} from '@mantine/core';
import {Form, Outlet, useLoaderData} from '@remix-run/react';
import {json, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {AccountButton} from '~/components/account/AccountButton';
import {AccountContent} from '~/components/account/AccountContent';
import {AccountTitle} from '~/components/account/AccountTitle';
import {getBookingShopifyApi} from '~/lib/api/bookingShopifyApi';
import {getCustomer} from '~/lib/get-customer';

export async function loader({context, params}: LoaderFunctionArgs) {
  const customerId = await getCustomer({context});

  const {productId} = params;
  if (!productId) {
    throw new Error('Missing productId param, check route filename');
  }

  const {payload: product} = await getBookingShopifyApi().customerProductGet(
    customerId,
    productId,
    context,
  );

  return json({product});
}

export default function EditAddress() {
  const {product} = useLoaderData<typeof loader>();

  return (
    <Container size="md" my={{base: rem(80), sm: rem(100)}}>
      <AccountTitle linkBack="/account/services" heading={product.title}>
        <AccountButton
          to={`/account/services/${product.productId}`}
          data-testid="basic-button"
        >
          Detaljer
        </AccountButton>
        <AccountButton to={'options'} data-testid="booking-button">
          Varianter
        </AccountButton>
        <AccountButton to={'configuration'} data-testid="booking-button">
          Konfiguration
        </AccountButton>
        <Form
          method="post"
          action={`/account/services/${product.productId}/destroy`}
          style={{display: 'inline-block'}}
        >
          <Button
            variant="outline"
            radius="xl"
            color="red"
            fullWidth
            type="submit"
            data-testid="delete-button"
          >
            Slet
          </Button>
        </Form>
      </AccountTitle>

      <AccountContent>
        <Outlet context={{product}} />
      </AccountContent>
    </Container>
  );
}
