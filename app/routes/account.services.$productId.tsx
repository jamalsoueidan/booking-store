import {Button} from '@mantine/core';
import {Form, Outlet, useLoaderData} from '@remix-run/react';
import {CacheLong, parseGid} from '@shopify/hydrogen';
import {json, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {AccountButton} from '~/components/account/AccountButton';
import {AccountContent} from '~/components/account/AccountContent';
import {AccountTitle} from '~/components/account/AccountTitle';
import {PRODUCT_QUERY_ID} from '~/data/queries';

export async function loader({context, params}: LoaderFunctionArgs) {
  await context.customerAccount.handleAuthStatus();

  const {productId} = params;
  if (!productId) {
    throw new Error('Missing productHandle param, check route filename');
  }

  const data = await context.storefront.query(PRODUCT_QUERY_ID, {
    variables: {
      Id: `gid://shopify/Product/${productId}`,
      country: context.storefront.i18n.country,
      language: context.storefront.i18n.language,
    },
    cache: CacheLong(),
  });

  if (!data?.product?.id) {
    throw new Response('product', {status: 404});
  }

  return json({
    selectedProduct: data.product,
  });
}

export default function EditAddress() {
  const {selectedProduct} = useLoaderData<typeof loader>();

  return (
    <>
      <AccountTitle
        linkBack="/account/services"
        heading={selectedProduct.title}
      >
        <AccountButton
          to={`/account/services/${parseGid(selectedProduct.id).id}`}
          data-testid="basic-button"
        >
          Produkt detaljer
        </AccountButton>
        <AccountButton to={'booking'} data-testid="booking-button">
          Bookingkonfiguration
        </AccountButton>
        <AccountButton to={'options'} data-testid="booking-button">
          Valg muligheder
        </AccountButton>
        <Form
          method="post"
          action={`/account/services/${
            parseGid(selectedProduct.id).id
          }/destroy`}
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
        <Outlet context={{selectedProduct}} />
      </AccountContent>
    </>
  );
}
