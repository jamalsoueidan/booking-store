import {
  Form,
  useLoaderData,
  useNavigate,
  useOutletContext,
  type ShouldRevalidateFunction,
} from '@remix-run/react';
import {
  json,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
  type SerializeFrom,
} from '@shopify/remix-oxygen';
import {getCustomer} from '~/lib/get-customer';
import {type loader as rootLoader} from './account.services.$productId';

import {Flex, Select, Stack, Text} from '@mantine/core';
import {useCallback, useRef, useState} from 'react';
import {SubmitButton} from '~/components/form/SubmitButton';
import {PRODUCT_TAG_OPTIONS_QUERY} from '~/graphql/storefront/ProductTagOptions';
import {getBookingShopifyApi} from '~/lib/api/bookingShopifyApi';

export const shouldRevalidate: ShouldRevalidateFunction = () => {
  return false;
};

export const action = async ({
  request,
  context,
  params,
}: ActionFunctionArgs) => {
  const customerId = await getCustomer({context});
  const formData = await request.formData();
  const {productId} = params;

  if (!productId) {
    throw new Error('Missing productHandle param, check route filename');
  }

  const optionProductId = String(formData.get('optionProductId'));
  const title = String(formData.get('title'));
  const productTitle = String(formData.get('productTitle'));

  await getBookingShopifyApi().customerProductOptionsAdd(
    customerId,
    productId,
    {
      cloneId: optionProductId,
      title: `${title} - (${productTitle})`,
    },
  );

  return null;
};

export async function loader({context}: LoaderFunctionArgs) {
  const customerId = await getCustomer({context});
  const {storefront} = context;

  const {products} = await storefront.query(PRODUCT_TAG_OPTIONS_QUERY, {
    variables: {
      query: "(tag:'system') AND (tag:'options')",
    },
    cache: storefront.CacheLong(),
  });

  const {products: options} = await context.storefront.query(
    PRODUCT_TAG_OPTIONS_QUERY,
    {
      variables: {
        query: `tag:user AND tag:customer-${customerId} AND NOT id:${Math.ceil(
          Math.random() * 1000,
        )}`,
      },
      cache: context.storefront.CacheNone(),
    },
  );

  return json({products, totalOptions: options.nodes.length});
}

export default function Component() {
  const {products, totalOptions} = useLoaderData<typeof loader>();
  const [optionProductId, setOptionProductId] = useState<string | null>(null);
  const {selectedProduct} =
    useOutletContext<SerializeFrom<typeof rootLoader>>();

  const polling = usePolling({
    url: location.pathname.replace(/add$/, 'poll'),
    interval: 2000,
    totalOptions,
  });

  const selectedOptionProduct = optionProductId
    ? products.nodes.find((p) => p.id === optionProductId)
    : null;

  return (
    <Form method="POST">
      <Stack>
        {totalOptions}
        <Flex direction="column" gap="md">
          <Stack gap="0" style={{flex: 1}}>
            <Text fw="bold">Valg muligheder:</Text>
            <Text>
              Hvilken valg mulighed vil du tilføje til den her ydelse??
            </Text>
          </Stack>
          <Flex gap="lg" style={{flex: 1}}>
            <Select
              data={products.nodes.map((p) => ({value: p.id, label: p.title}))}
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
            <SubmitButton onClick={() => polling.startPolling()}>
              Tilføj
            </SubmitButton>
          </Flex>
        </Flex>
      </Stack>
    </Form>
  );
}

function usePolling({
  url,
  interval,
  totalOptions,
}: {
  url: string;
  interval: number;
  totalOptions: number;
}) {
  const navigate = useNavigate();
  const intervalRef = useRef<number | null>(null);

  const stopPolling = useCallback(() => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const startPolling = useCallback(() => {
    if (intervalRef.current !== null) return;

    intervalRef.current = setInterval(() => {
      fetch(url)
        .then((response) => response.json())
        .then((data) => {
          if (parseInt(data as string) > totalOptions) {
            stopPolling();
            navigate(url.replace(/poll$/, ''));
          }
        });
    }, interval) as unknown as number;
  }, [interval, url, totalOptions, stopPolling, navigate]);

  return {startPolling, stopPolling};
}
