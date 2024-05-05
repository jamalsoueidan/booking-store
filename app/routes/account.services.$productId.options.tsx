import {
  Form,
  useFetcher,
  useFetchers,
  useLoaderData,
  useOutletContext,
} from '@remix-run/react';
import {
  json,
  type LoaderFunctionArgs,
  type SerializeFrom,
} from '@shopify/remix-oxygen';
import {getCustomer} from '~/lib/get-customer';
import {type loader as rootLoader} from './account.services.$productId';

import {
  Accordion,
  Anchor,
  Button,
  Flex,
  Modal,
  Select,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import {useDisclosure} from '@mantine/hooks';
import {useEffect, useState} from 'react';

import {type ServicesOptionsTagProductFragment} from 'storefrontapi.generated';
import {ServicesOptionsTagOptions} from '~/graphql/account/ServicesOptions';
import {getBookingShopifyApi} from '~/lib/api/bookingShopifyApi';
import {type CustomerProductOption} from '~/lib/api/model';

export async function loader({context, params}: LoaderFunctionArgs) {
  const customerId = await getCustomer({context});
  const {storefront} = context;
  const {productId} = params;

  if (!productId) {
    throw new Error('Missing productHandle param, check route filename');
  }

  const {products: systemOptions} = await storefront.query(
    ServicesOptionsTagOptions,
    {
      variables: {
        first: 5,
        query: "(tag:'system') AND (tag:'options')",
      },
      cache: storefront.CacheLong(),
    },
  );

  const {payload: response} =
    await getBookingShopifyApi().customerProductOptionsList(
      customerId,
      productId,
    );

  const productIds = response.map(({productId}) => productId);

  console.log({
    first: Math.ceil(Math.random() * 10) + 5,
    query:
      productIds.length > 0
        ? `${productIds.join(' OR ')} AND NOT id:${Math.ceil(
            Math.random() * 1000,
          )}`
        : 'id=testerne',
  });
  const {products: userOptions} = await storefront.query(
    ServicesOptionsTagOptions,
    {
      variables: {
        first: Math.ceil(Math.random() * 10) + 5,
        query:
          productIds.length > 0
            ? `${productIds.join(' OR ')} AND NOT id:${Math.ceil(
                Math.random() * 1000,
              )}`
            : 'id=testerne',
      },
      cache: storefront.CacheNone(),
    },
  );
  //

  return json({systemOptions, userOptions});
}

export default function Component() {
  const {systemOptions, userOptions} = useLoaderData<typeof loader>();
  const {selectedProduct} =
    useOutletContext<SerializeFrom<typeof rootLoader>>();
  const [opened, {open, close}] = useDisclosure(false);

  const fetchers = useFetchers();
  const userOptionsOpt = fetchers
    .filter((f) => f.key === 'duplicate-product' && f.state === 'loading')
    .reduce<Array<CustomerProductOption>>((options, next) => {
      const found = options.find((o) => o.id === next.data.id);
      if (next.data && !found) {
        options.push(next.data);
      }
      return options;
    }, []);

  let mergeOptions = [...userOptions.nodes, ...userOptionsOpt];

  mergeOptions = fetchers
    .filter((f) => f.key === 'destroy-product' && f.state === 'loading')
    .reduce<Array<CustomerProductOption | ServicesOptionsTagProductFragment>>(
      (options, next) => {
        const data = next.data as {deletedProductId: string};
        if (data) {
          return options.filter((p) => p.id !== data.deletedProductId);
        }
        return options;
      },
      mergeOptions,
    );

  return (
    <>
      <Anchor onClick={open}>Tilføj valg mulighed</Anchor>

      {mergeOptions.length > 0 ? (
        <>
          <Accordion variant="contained">
            {mergeOptions.map((option) => (
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
                      <Button type="submit" variant="filled">
                        Opdatere
                      </Button>
                      <DestroyButton optionProductId={option.id} />
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

      <Modal title="Vælg en valg-mulighed" opened={opened} onClose={close}>
        <OptionAddModal
          systemOptions={systemOptions}
          selectedProduct={selectedProduct}
          close={close}
        />
      </Modal>
    </>
  );
}

type OptionAddModalProps = {
  selectedProduct: SerializeFrom<typeof rootLoader>['selectedProduct'];
  systemOptions: SerializeFrom<typeof loader>['systemOptions'];
  close: () => void;
};

function OptionAddModal({
  selectedProduct,
  systemOptions,
  close,
}: OptionAddModalProps) {
  const [optionProductId, setOptionProductId] = useState<string | null>(null);
  const fetcher = useFetcher({key: 'duplicate-product'});
  const selectedOptionProduct = optionProductId
    ? systemOptions.nodes.find((p) => p.id === optionProductId)
    : null;

  useEffect(() => {
    if (fetcher.data && fetcher.state === 'loading') {
      close();
    }
  }, [close, fetcher.data, fetcher.state]);

  return (
    <fetcher.Form method="POST" action="add">
      <Stack>
        <Flex direction="column" gap="md">
          <Stack gap="0" style={{flex: 1}}>
            <Text fw="bold">Valg muligheder:</Text>
            <Text>
              Hvilken valg mulighed vil du tilføje til den her ydelse??
            </Text>
          </Stack>
          <Flex gap="lg" style={{flex: 1}}>
            <Select
              data={systemOptions.nodes.map((p) => ({
                value: p.id,
                label: p.title,
              }))}
              placeholder="-"
              name="optionProductId"
              onChange={setOptionProductId}
              allowDeselect={false}
              data-testid="options-select"
            />
            {selectedOptionProduct ? (
              <>
                <input
                  type="hidden"
                  name="title"
                  value={selectedOptionProduct.title}
                />
                <input
                  type="hidden"
                  name="productTitle"
                  value={selectedProduct.title}
                />
              </>
            ) : null}
            <Button type="submit" loading={fetcher.state !== 'idle'}>
              Tilføj
            </Button>
          </Flex>
        </Flex>
      </Stack>
    </fetcher.Form>
  );
}

function DestroyButton({optionProductId}: {optionProductId: string}) {
  const fetcher = useFetcher({key: 'destroy-product'});

  const destroy = () => {
    fetcher.submit({optionProductId}, {method: 'post', action: 'destroy'});
  };

  return (
    <Button variant="filled" color="red" onClick={destroy}>
      Slet
    </Button>
  );
}
