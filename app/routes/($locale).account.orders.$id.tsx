import {
  ActionIcon,
  Badge,
  Card,
  Divider,
  Flex,
  SimpleGrid,
  Table,
  Text,
  Title,
} from '@mantine/core';
import {Link, useLoaderData, type MetaFunction} from '@remix-run/react';
import {Image, Money, flattenConnection} from '@shopify/hydrogen';
import {json, redirect, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {IconArrowLeft} from '@tabler/icons-react';
import {format} from 'date-fns';
import {da} from 'date-fns/locale';
import type {OrderLineItemFullFragment} from 'storefrontapi.generated';

export const meta: MetaFunction<typeof loader> = ({data}) => {
  return [{title: `Order ${data?.order?.name}`}];
};

export async function loader({params, context}: LoaderFunctionArgs) {
  const {session, storefront} = context;

  if (!params.id) {
    return redirect('/account/orders');
  }

  const orderId = atob(params.id);
  const customerAccessToken = await session.get('customerAccessToken');

  if (!customerAccessToken) {
    return redirect('/account/login');
  }

  const {order} = await storefront.query(CUSTOMER_ORDER_QUERY, {
    variables: {orderId},
  });

  if (!order || !('lineItems' in order)) {
    throw new Response('Order not found', {status: 404});
  }

  const lineItems = flattenConnection(order.lineItems);
  const discountApplications = flattenConnection(order.discountApplications);

  const firstDiscount = discountApplications[0]?.value;

  const discountValue =
    firstDiscount?.__typename === 'MoneyV2' && firstDiscount;

  const discountPercentage =
    firstDiscount?.__typename === 'PricingPercentageValue' &&
    firstDiscount?.percentage;

  return json({
    order,
    lineItems,
    discountValue,
    discountPercentage,
  });
}

export default function OrderRoute() {
  const {order, lineItems, discountValue, discountPercentage} =
    useLoaderData<typeof loader>();
  return (
    <>
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

      <Table>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Produkt</Table.Th>
            <Table.Th>Pris</Table.Th>
            <Table.Th> Total</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {lineItems.map((lineItem, lineItemIndex) => (
            // eslint-disable-next-line react/no-array-index-key
            <OrderLineRow key={lineItemIndex} lineItem={lineItem} />
          ))}
        </Table.Tbody>
      </Table>
      <SimpleGrid cols={{base: 1, md: 2}} mt="lg">
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
            <Text>No shipping address defined</Text>
          )}
        </Card>
      </SimpleGrid>
    </>
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
        {lineItem.customAttributes
          .filter((option) => {
            return option.key[0] !== '_';
          })
          .map((option, index, all) => (
            <Text key={option.key} size="xs">
              <strong>{option.key}</strong>: {option.value}
            </Text>
          ))}
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
