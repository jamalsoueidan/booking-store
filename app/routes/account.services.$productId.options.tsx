import {
  Form,
  Link,
  Outlet,
  useLoaderData,
  useNavigate,
  useOutlet,
  useOutletContext,
} from '@remix-run/react';
import {
  json,
  redirect,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
  type SerializeFrom,
} from '@shopify/remix-oxygen';
import {getCustomer} from '~/lib/get-customer';
import {type loader as rootLoader} from './account.services.$productId';

import {Accordion, Anchor, Button, Flex, Modal, Title} from '@mantine/core';
import {PRODUCT_TAG_OPTIONS_QUERY} from '~/graphql/storefront/ProductTagOptions';
import {getBookingShopifyApi} from '~/lib/api/bookingShopifyApi';

export const action = async ({
  request,
  context,
  params,
}: ActionFunctionArgs) => {
  const customerId = await getCustomer({context});
  const formData = await request.formData();
  const {productId} = params;
  const intent = String(formData.get('intent'));
  const optionProductId = String(formData.get('optionProductId'));

  if (!productId) {
    throw new Error('Missing productHandle param, check route filename');
  }

  if (intent === 'destroy') {
    await getBookingShopifyApi().customerProductOptionsDestroy(
      customerId,
      productId,
      optionProductId,
    );
  }

  await new Promise((resolve) => setTimeout(resolve, 1500));

  return redirect(`/account/services/${productId}/options`);
};

export async function loader({context}: LoaderFunctionArgs) {
  const customerId = await getCustomer({context});
  const {storefront} = context;

  const {products: options} = await storefront.query(
    PRODUCT_TAG_OPTIONS_QUERY,
    {
      variables: {
        query: `tag:user AND tag:customer-${customerId} AND NOT id:${Math.ceil(
          Math.random() * 1000,
        )}`,
      },
      cache: storefront.CacheNone(),
    },
  );

  return json({options});
}

export default function Component() {
  const {options} = useLoaderData<typeof loader>();
  const {selectedProduct} =
    useOutletContext<SerializeFrom<typeof rootLoader>>();
  const inOutlet = !!useOutlet();
  const navigate = useNavigate();

  const closeModal = () => {
    navigate(-1);
  };

  return (
    <>
      <Anchor component={Link} to="add">
        Tilføj valg mulighed
      </Anchor>

      {options.nodes.length > 0 ? (
        <>
          <Accordion variant="contained">
            {options.nodes.map((option) => (
              <Accordion.Item value={option.id} key={option.id}>
                <Accordion.Control>{option.title}</Accordion.Control>
                <Accordion.Panel>
                  <Form method="post">
                    <input
                      type="hidden"
                      name="optionProductId"
                      value={option.id}
                    />
                    <Flex gap="sm">
                      <Button
                        type="submit"
                        name="intent"
                        value="update"
                        variant="filled"
                      >
                        Opdatere
                      </Button>
                      <Button
                        type="submit"
                        name="intent"
                        value="destroy"
                        variant="filled"
                        color="red"
                      >
                        Slet
                      </Button>
                    </Flex>
                  </Form>
                </Accordion.Panel>
              </Accordion.Item>
            ))}
          </Accordion>
        </>
      ) : (
        <Title order={3}>
          Der er ikke tilføjet valg muligheder til dette produkt
        </Title>
      )}

      <Modal
        title="Vælg en valg-mulighed"
        opened={inOutlet}
        onClose={closeModal}
      >
        <Outlet context={{selectedProduct}} />
      </Modal>
    </>
  );
}
