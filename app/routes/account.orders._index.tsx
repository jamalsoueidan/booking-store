import {Button, Card, Container, Flex, rem, Table, Title} from '@mantine/core';
import {Link, useLoaderData, type MetaFunction} from '@remix-run/react';
import {
  flattenConnection,
  getPaginationVariables,
  Money,
  Pagination,
} from '@shopify/hydrogen';
import {json, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {IconHeartHandshake} from '@tabler/icons-react';
import type {
  CustomerOrdersFragment,
  OrderItemFragment,
} from 'customer-accountapi.generated';
import {useTranslation} from 'react-i18next';
import {AccountContent} from '~/components/account/AccountContent';
import {AccountTitle} from '~/components/account/AccountTitle';
import {CUSTOMER_ORDERS_QUERY} from '~/graphql/customer-account/CustomerOrdersQuery';
import {useDate} from '~/lib/duration';

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
  const {t} = useTranslation(['account'], {keyPrefix: 'orders'});
  const {customer} = useLoaderData<{customer: CustomerOrdersFragment}>();
  const {orders} = customer;

  return (
    <Container size="md" my={{base: rem(80), sm: rem(100)}}>
      <AccountTitle linkBack="/account/dashboard" heading={t('title')} />
      <AccountContent>
        <OrdersTable orders={orders} />
      </AccountContent>
    </Container>
  );
}

function OrdersTable({orders}: Pick<CustomerOrdersFragment, 'orders'>) {
  const {t} = useTranslation(['account', 'global'], {keyPrefix: 'orders'});
  return orders?.nodes.length ? (
    <Pagination connection={orders}>
      {({nodes, isLoading, PreviousLink, NextLink}) => {
        return (
          <>
            <Flex justify="center">
              <Button component={PreviousLink} loading={isLoading}>
                ↑ {t('global:pagination_previous_button')}
              </Button>
            </Flex>
            <Table>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>{t('date')}</Table.Th>
                  <Table.Th>{t('payment')}</Table.Th>
                  <Table.Th>{t('status')}</Table.Th>
                  <Table.Th>{t('total')}</Table.Th>
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
                {t('global:pagination_next_button')} ↓
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
  const {t} = useTranslation(['account', 'global'], {keyPrefix: 'orders'});
  return (
    <Card>
      <Flex direction="column" align="center">
        <IconHeartHandshake size="25%" opacity={0.7} stroke={1} />
        <Title order={3} fw={500} mb="lg">
          {t('empty')}
        </Title>
        <Button component={Link} to="/">
          {t('goto_frontpage')} →
        </Button>
      </Flex>
    </Card>
  );
}

function OrderItem({order}: {order: OrderItemFragment}) {
  const {format} = useDate();
  const fulfillmentStatus = flattenConnection(order.fulfillments)[0]?.status;
  return (
    <Table.Tr>
      <Table.Td>{format(new Date(order.processedAt), 'PPPP')}</Table.Td>
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
