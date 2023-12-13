import {Button, Card, Divider, Flex, Table, Title} from '@mantine/core';
import {Link, useLoaderData, type MetaFunction} from '@remix-run/react';
import {Money, Pagination, getPaginationVariables} from '@shopify/hydrogen';
import {json, redirect, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {IconHeartHandshake} from '@tabler/icons-react';
import {format} from 'date-fns';
import {da} from 'date-fns/locale';
import type {
  CustomerOrdersFragment,
  OrderItemFragment,
} from 'storefrontapi.generated';

export const meta: MetaFunction = () => {
  return [{title: 'Orders'}];
};

export async function loader({request, context}: LoaderFunctionArgs) {
  const {session, storefront} = context;

  const customerAccessToken = await session.get('customerAccessToken');
  if (!customerAccessToken?.accessToken) {
    return redirect('/account/login');
  }

  try {
    const paginationVariables = getPaginationVariables(request, {
      pageBy: 20,
    });

    const {customer} = await storefront.query(CUSTOMER_ORDERS_QUERY, {
      variables: {
        customerAccessToken: customerAccessToken.accessToken,
        country: storefront.i18n.country,
        language: storefront.i18n.language,
        ...paginationVariables,
      },
      cache: storefront.CacheNone(),
    });

    if (!customer) {
      throw new Error('Customer not found');
    }

    return json({customer});
  } catch (error: unknown) {
    if (error instanceof Error) {
      return json({error: error.message}, {status: 400});
    }
    return json({error}, {status: 400});
  }
}

export default function Orders() {
  const {customer} = useLoaderData<{customer: CustomerOrdersFragment}>();
  const {orders, numberOfOrders} = customer;
  return (
    <>
      <Title>
        Orders <small>({numberOfOrders})</small>
      </Title>
      <Divider my="md" />
      {orders.nodes.length ? <OrdersTable orders={orders} /> : <EmptyOrders />}
    </>
  );
}

function OrdersTable({orders}: Pick<CustomerOrdersFragment, 'orders'>) {
  return (
    <>
      {orders?.nodes.length ? (
        <Pagination connection={orders}>
          {({nodes, isLoading, PreviousLink, NextLink}) => {
            return (
              <>
                <Flex justify="center">
                  <Button component={PreviousLink} loading={isLoading}>
                    ↑ Hent tidligere
                  </Button>
                </Flex>
                <Table>
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th>#</Table.Th>
                      <Table.Th>Dato</Table.Th>
                      <Table.Th>Betaling</Table.Th>
                      <Table.Th>Status</Table.Th>
                      <Table.Th>Beløb</Table.Th>
                      <Table.Th></Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {nodes.map((order) => {
                      return <OrderItem key={order.id} order={order} />;
                    })}
                  </Table.Tbody>
                </Table>

                <br />
                <Flex justify="center">
                  <Button component={NextLink} loading={isLoading}>
                    Hent flere ↓
                  </Button>
                </Flex>
              </>
            );
          }}
        </Pagination>
      ) : (
        <EmptyOrders />
      )}
    </>
  );
}

function EmptyOrders() {
  return (
    <Card>
      <Flex direction="column" align="center">
        <IconHeartHandshake size="25%" opacity={0.7} stroke={1} />
        <Title order={3} fw={500} mb="lg">
          Du har ikke afgivet nogen ordre endnu
        </Title>
        <Button component={Link} to="/">
          Gå til forside →
        </Button>
      </Flex>
    </Card>
  );
}

function OrderItem({order}: {order: OrderItemFragment}) {
  return (
    <Table.Tr>
      <Table.Td>
        <Link to={`/account/orders/${order.id}`}>
          <strong>#{order.orderNumber}</strong>
        </Link>
      </Table.Td>
      <Table.Td>
        {format(new Date(order.processedAt), 'PPPP', {locale: da})}
      </Table.Td>
      <Table.Td>{order.financialStatus}</Table.Td>
      <Table.Td>{order.fulfillmentStatus}</Table.Td>
      <Table.Td>
        <Money data={order.currentTotalPrice} />
      </Table.Td>
      <Table.Td>
        <Button
          size="compact-sm"
          component={Link}
          to={`/account/orders/${btoa(order.id)}`}
        >
          Vis ordre
        </Button>
      </Table.Td>
    </Table.Tr>
  );
}

const ORDER_ITEM_FRAGMENT = `#graphql
  fragment OrderItem on Order {
    currentTotalPrice {
      amount
      currencyCode
    }
    financialStatus
    fulfillmentStatus
    id
    lineItems(first: 10) {
      nodes {
        title
        variant {
          image {
            url
            altText
            height
            width
          }
        }
      }
    }
    orderNumber
    customerUrl
    statusUrl
    processedAt
  }
` as const;

export const CUSTOMER_FRAGMENT = `#graphql
  fragment CustomerOrders on Customer {
    numberOfOrders
    orders(
      sortKey: PROCESSED_AT,
      reverse: true,
      first: $first,
      last: $last,
      before: $startCursor,
      after: $endCursor
    ) {
      nodes {
        ...OrderItem
      }
      pageInfo {
        hasPreviousPage
        hasNextPage
        endCursor
        startCursor
      }
    }
  }
  ${ORDER_ITEM_FRAGMENT}
` as const;

// NOTE: https://shopify.dev/docs/api/storefront/latest/queries/customer
const CUSTOMER_ORDERS_QUERY = `#graphql
  ${CUSTOMER_FRAGMENT}
  query CustomerOrders(
    $country: CountryCode
    $customerAccessToken: String!
    $endCursor: String
    $first: Int
    $language: LanguageCode
    $last: Int
    $startCursor: String
  ) @inContext(country: $country, language: $language) {
    customer(customerAccessToken: $customerAccessToken) {
      ...CustomerOrders
    }
  }
` as const;
