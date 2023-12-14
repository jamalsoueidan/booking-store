import {
  ActionIcon,
  Badge,
  Button,
  Card,
  Divider,
  Flex,
  SimpleGrid,
  Stack,
  Table,
  Text,
  Title,
} from '@mantine/core';
import {useDisclosure} from '@mantine/hooks';
import {
  Link,
  useFetcher,
  useLoaderData,
  type MetaFunction,
} from '@remix-run/react';
import {Image, Money, flattenConnection, parseGid} from '@shopify/hydrogen';
import {json, redirect, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {IconArrowLeft} from '@tabler/icons-react';
import {format} from 'date-fns';
import {da} from 'date-fns/locale';
import type {OrderLineItemFullFragment} from 'storefrontapi.generated';
import ModalBooking from '~/components/account/ModalBooking';
import {isEqualGid} from '~/data/isEqualGid';
import {getBookingShopifyApi} from '~/lib/api/bookingShopifyApi';
import type {
  CustomerOrderArrayLineItems,
  CustomerOrderLineItem,
} from '~/lib/api/model';
import {getCustomer} from '~/lib/get-customer';
import {type ApiOrdersLineItem} from './($locale).api.orders.$productId.lineitem.$lineItem';

export const meta: MetaFunction<typeof loader> = ({data}) => {
  return [{title: `Order ${data?.order?.name}`}];
};

export async function loader({params, context}: LoaderFunctionArgs) {
  const customer = await getCustomer({context});
  const {session, storefront} = context;

  if (!params.id) {
    return redirect('/account/orders');
  }

  const orderId = atob(params.id);

  const {order} = await storefront.query(CUSTOMER_ORDER_QUERY, {
    variables: {orderId},
  });

  if (!order || !('lineItems' in order)) {
    throw new Response('Order not found', {status: 404});
  }

  const {payload: treatmentOrder} =
    await getBookingShopifyApi().customerOrderGet(
      parseGid(customer.id).id,
      parseGid(order.id).id,
    );

  const lineItems = flattenConnection(order.lineItems);
  const discountApplications = flattenConnection(order.discountApplications);

  const firstDiscount = discountApplications[0]?.value;

  const discountValue =
    firstDiscount?.__typename === 'MoneyV2' && firstDiscount;

  const discountPercentage =
    firstDiscount?.__typename === 'PricingPercentageValue' &&
    firstDiscount?.percentage;

  return json({
    treatmentOrder,
    order,
    lineItems,
    discountValue,
    discountPercentage,
  });
}

export default function OrderRoute() {
  const {treatmentOrder, order, lineItems, discountValue, discountPercentage} =
    useLoaderData<typeof loader>();

  const productsLineItems = lineItems.filter(
    (p) => p.customAttributes.length === 0,
  );

  return (
    <Stack gap="lg">
      <Flex direction={'row'} align={'center'}>
        <Link to="/account/orders">
          <ActionIcon
            variant="transparent"
            size="xl"
            aria-label="Back"
            color="black"
          >
            <IconArrowLeft style={{width: '70%', height: '70%'}} stroke={1.5} />
          </ActionIcon>
        </Link>
        <div>
          <Title>Ordre {order.name}</Title>
          <Text c="dimmed" size="sm">
            Købt {format(new Date(order.processedAt!), 'PPPP', {locale: da})}
            <Badge ml="xs">{order.fulfillmentStatus}</Badge>
          </Text>
        </div>
      </Flex>
      <Divider my="md" />

      <TreatmentTable treatmentOrder={treatmentOrder} lineItems={lineItems} />

      {productsLineItems.length > 0 ? (
        <Card withBorder>
          <Title order={3} mb="md">
            Produkter:
          </Title>
          <Table>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Billed:</Table.Th>
                <Table.Th>Beskrivelse</Table.Th>
                <Table.Th> Total</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {productsLineItems.map((l) => (
                <OrderLineRow key={l.title + l.quantity} lineItem={l} />
              ))}
            </Table.Tbody>
          </Table>
        </Card>
      ) : null}

      <SimpleGrid cols={{base: 1, md: 2}}>
        <Card shadow="0" padding="md" radius="md" withBorder>
          <Text fw={500} size="lg" mb="md">
            Summary
          </Text>

          {((discountValue && discountValue.amount) || discountPercentage) && (
            <Flex justify="space-between" mb="cs">
              <Text>Discounts</Text>

              {discountPercentage ? (
                <span>-{discountPercentage}% OFF</span>
              ) : (
                discountValue && <Money data={discountValue!} />
              )}
            </Flex>
          )}

          <Flex justify="space-between" mb="xs">
            <Text>Subtotal</Text>
            <Money data={order.subtotalPriceV2!} />
          </Flex>
          <Flex justify="space-between" mb="xs">
            <Text>Moms</Text>
            <Money data={order.totalTaxV2!} />
          </Flex>
          <Flex justify="space-between">
            <Text>Total</Text>
            <Money data={order.totalPriceV2!} />
          </Flex>
        </Card>
        <Card shadow="0" padding="md" radius="md" withBorder>
          <Text fw={500} size="lg" mb="md">
            Forsendelse
          </Text>
          {order?.shippingAddress ? (
            <>
              <Text>
                {order.shippingAddress.firstName &&
                  order.shippingAddress.firstName + ' '}
                {order.shippingAddress.lastName}
              </Text>
              {order?.shippingAddress?.formatted ? (
                order.shippingAddress.formatted.map((line: string) => (
                  <Text key={line}>{line}</Text>
                ))
              ) : (
                <></>
              )}
            </>
          ) : (
            <Text>Ingen forsendelse</Text>
          )}
        </Card>
      </SimpleGrid>
    </Stack>
  );
}

function TreatmentTable({
  treatmentOrder,
  lineItems,
}: {
  treatmentOrder: CustomerOrderArrayLineItems;
  lineItems: OrderLineItemFullFragment[];
}) {
  const [opened, {open, close}] = useDisclosure(false);
  const fetcher = useFetcher<ApiOrdersLineItem>();
  const openModal = (lineItem: CustomerOrderLineItem) => {
    fetcher.load(`/api/orders/${lineItem.product_id}/lineitem/${lineItem.id}`);
    open();
  };

  if (treatmentOrder.line_items.length === 0) return null;

  return (
    <>
      <Card withBorder>
        <Title order={3} mb="md">
          Behandlinger
        </Title>
        <Table>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Billed:</Table.Th>
              <Table.Th>Detaljer:</Table.Th>
              <Table.Th>Total</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {treatmentOrder.line_items.map((l) => {
              const lineItem = lineItems.find((p) =>
                isEqualGid(p.variant?.id!, l.variant_id || 0),
              );
              return (
                <TreatmentLineRow
                  key={l.id}
                  lineItem={l}
                  orderLineItem={lineItem!}
                  openModal={openModal}
                />
              );
            })}
          </Table.Tbody>
        </Table>
      </Card>

      <ModalBooking opened={opened} data={fetcher.data} close={close} />
    </>
  );
}

function TreatmentLineRow({
  lineItem,
  orderLineItem,
  openModal,
}: {
  lineItem: CustomerOrderLineItem;
  orderLineItem: OrderLineItemFullFragment;
  openModal: (lineItem: CustomerOrderLineItem) => void;
}) {
  return (
    <Table.Tr>
      <Table.Td>
        <Link to={`/products/`}>
          {orderLineItem.variant?.image && (
            <div>
              <Image
                data={orderLineItem.variant.image}
                width={96}
                height={96}
              />
            </div>
          )}
        </Link>
      </Table.Td>
      <Table.Td valign="top" width="100%">
        <Text mb="xs">
          {lineItem.title} <small>({orderLineItem.variant!.title})</small>
        </Text>
        <Text size="sm">
          {format(
            new Date(lineItem.properties.from || ''),
            "EEEE 'd.' d'.' LLL 'kl 'HH:mm",
            {
              locale: da,
            },
          )}
        </Text>

        <Button
          size="compact-sm"
          mt="xs"
          onClick={() => {
            openModal(lineItem);
          }}
        >
          Vis behandlingsdetaljer
        </Button>
      </Table.Td>
      <Table.Td valign="top">
        <Money data={orderLineItem.discountedTotalPrice!} />
      </Table.Td>
    </Table.Tr>
  );
}

function OrderLineRow({lineItem}: {lineItem: OrderLineItemFullFragment}) {
  return (
    <Table.Tr>
      <Table.Td>
        <Link to={`/products/${lineItem.variant!.product!.handle}`}>
          {lineItem?.variant?.image && (
            <div>
              <Image data={lineItem.variant.image} width={96} height={96} />
            </div>
          )}
        </Link>
      </Table.Td>
      <Table.Td valign="top" width="100%">
        <Text mb="xs">
          {lineItem.title} <small>({lineItem.variant!.title})</small>
        </Text>
      </Table.Td>
      <Table.Td valign="top">
        <Money data={lineItem.discountedTotalPrice!} />
      </Table.Td>
    </Table.Tr>
  );
}

// NOTE: https://shopify.dev/docs/api/storefront/latest/objects/Order
const CUSTOMER_ORDER_QUERY = `#graphql
  fragment OrderMoney on MoneyV2 {
    amount
    currencyCode
  }
  fragment AddressFull on MailingAddress {
    address1
    address2
    city
    company
    country
    countryCodeV2
    firstName
    formatted
    id
    lastName
    name
    phone
    province
    provinceCode
    zip
  }
  fragment DiscountApplication on DiscountApplication {
    value {
      __typename
      ... on MoneyV2 {
        ...OrderMoney
      }
      ... on PricingPercentageValue {
        percentage
      }
    }
  }
  fragment OrderLineProductVariant on ProductVariant {
    id
    image {
      altText
      height
      url
      id
      width
    }
    price {
      ...OrderMoney
    }
    product {
      id
      handle
    }
    sku
    title
  }
  fragment OrderLineItemFull on OrderLineItem {
    title
    quantity
    discountAllocations {
      allocatedAmount {
        ...OrderMoney
      }
      discountApplication {
        ...DiscountApplication
      }
    }
    originalTotalPrice {
      ...OrderMoney
    }
    discountedTotalPrice {
      ...OrderMoney
    }
    customAttributes {
      key
      value
    }
    variant {
      ...OrderLineProductVariant
    }
  }
  fragment Order on Order {
    id
    name
    orderNumber
    statusUrl
    processedAt
    fulfillmentStatus
    totalTaxV2 {
      ...OrderMoney
    }
    totalPriceV2 {
      ...OrderMoney
    }
    subtotalPriceV2 {
      ...OrderMoney
    }
    shippingAddress {
      ...AddressFull
    }
    discountApplications(first: 100) {
      nodes {
        ...DiscountApplication
      }
    }
    lineItems(first: 100) {
      nodes {
        ...OrderLineItemFull
      }
    }
  }
  query Order(
    $country: CountryCode
    $language: LanguageCode
    $orderId: ID!
  ) @inContext(country: $country, language: $language) {
    order: node(id: $orderId) {
      ... on Order {
        ...Order
      }
    }
  }
` as const;
