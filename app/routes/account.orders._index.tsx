import {Button, Card, Flex, Table, Title} from '@mantine/core';
import {Link, useLoaderData, type MetaFunction} from '@remix-run/react';
import {
  Money,
  Pagination,
  flattenConnection,
  getPaginationVariables,
} from '@shopify/hydrogen';
import {json, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {IconHeartHandshake} from '@tabler/icons-react';
import type {
  CustomerOrdersFragment,
  OrderItemFragment,
} from 'customer-accountapi.generated';
import {format} from 'date-fns';
import {da} from 'date-fns/locale';
import {AccountContent} from '~/components/account/AccountContent';
import {AccountTitle} from '~/components/account/AccountTitle';
import {CUSTOMER_ORDERS_QUERY} from '~/graphql/customer-account/CustomerOrdersQuery';

export const meta: MetaFunction = () => {
  return [{title: 'Købshistorik'}];
};

export async function loader({request, context}: LoaderFunctionArgs) {
  const paginationVariables = getPaginationVariables(request, {
    pageBy: 20,
  });

  const {data, errors} = await context.customerAccount.query(
    CUSTOMER_ORDERS_QUERY,
    {
      variables: {
        ...paginationVariables,
      },
    },
  );

  if (errors?.length || !data?.customer) {
    throw Error('Customer orders not found');
  }

  return json(
    {customer: data.customer},
    {
      headers: {
        'Set-Cookie': await context.session.commit(),
      },
    },
  );
}

export default function Orders() {
  const {customer} = useLoaderData<{customer: CustomerOrdersFragment}>();
  const {orders} = customer;
  return (
    <>
      <AccountTitle
        heading={
          <>
            Orders <small>({orders.nodes.length})</small>
          </>
        }
      />
      <AccountContent>
        <OrdersTable orders={orders} />
      </AccountContent>
    </>
  );
}

function OrdersTable({orders}: Pick<CustomerOrdersFragment, 'orders'>) {
  return orders?.nodes.length ? (
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
  const fulfillmentStatus = flattenConnection(order.fulfillments)[0]?.status;
  return (
    <Table.Tr>
      <Table.Td>
        {format(new Date(order.processedAt), 'PPPP', {locale: da})}
      </Table.Td>
      <Table.Td>{order.financialStatus}</Table.Td>
      <Table.Td>{fulfillmentStatus && <p>{fulfillmentStatus}</p>}</Table.Td>
      <Table.Td>
        <Money data={order.totalPrice} />
      </Table.Td>
      <Table.Td>
        <Button
          size="compact-sm"
          component={Link}
          to={`/account/orders/${btoa(order.id)}`}
        >
          #{order.number}
        </Button>
      </Table.Td>
    </Table.Tr>
  );
}
