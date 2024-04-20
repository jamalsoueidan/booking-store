import {Button} from '@mantine/core';
import {Form, Outlet, useLoaderData} from '@remix-run/react';
import {parseGid} from '@shopify/hydrogen';
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
        <AccountButton to={'./'}>Basic</AccountButton>
        <AccountButton to={'advanced'}>Advanceret</AccountButton>
        <Form
          method="post"
          action={`${parseGid(selectedProduct.id).id}/destroy`}
          style={{display: 'inline-block'}}
        >
          <Button
            radius="xl"
            size="compact-sm"
            variant="filled"
            color="red"
            fullWidth
            type="submit"
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
