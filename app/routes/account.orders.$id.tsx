import {
  Badge,
  Card,
  Flex,
  rem,
  SimpleGrid,
  Stack,
  Table,
  Text,
  Title,
} from '@mantine/core';
import {Link, useLoaderData, type MetaFunction} from '@remix-run/react';
import {flattenConnection, Image, Money, parseGid} from '@shopify/hydrogen';
import {json, redirect, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import type {OrderLineItemFullFragment} from 'customer-accountapi.generated';
import {format} from 'date-fns';
import {da} from 'date-fns/locale';
import {AccountContent} from '~/components/account/AccountContent';
import {AccountTitle} from '~/components/account/AccountTitle';
import {isEqualGid} from '~/data/isEqualGid';
import {CUSTOMER_ORDER_QUERY} from '~/graphql/customer-account/CustomerOrderQuery';
import {getBookingShopifyApi} from '~/lib/api/bookingShopifyApi';
import type {
  CustomerOrder,
  CustomerOrderGetResponse,
  CustomerOrderLineItem,
} from '~/lib/api/model';
import {getCustomer} from '~/lib/get-customer';

export const meta: MetaFunction<typeof loader> = ({data}) => {
  return [{title: `Order ${data?.order?.name}`}];
};

export async function loader({params, context, request}: LoaderFunctionArgs) {
  const customerId = await getCustomer({context});

  if (!params.id) {
    return redirect('/account/orders');
  }

  const orderId = atob(params.id);

  const {data, errors} = await context.customerAccount.query(
    CUSTOMER_ORDER_QUERY,
    {
      variables: {orderId},
    },
  );

  if (errors?.length || !data?.order) {
    throw new Error('Order not found');
  }

  const {order} = data;

  let treatment: CustomerOrderGetResponse | undefined = undefined;
  try {
    treatment = await getBookingShopifyApi().customerOrderGet(
      customerId,
      parseGid(order.id).id,
    );
  } catch (error) {}

  const lineItems = flattenConnection(order.lineItems);
  const discountApplications = flattenConnection(order.discountApplications);
  const fulfillmentStatus = flattenConnection(order.fulfillments);

  const firstDiscount = discountApplications[0]?.value;

  const discountValue =
    firstDiscount?.__typename === 'MoneyV2' && firstDiscount;

  const discountPercentage =
    firstDiscount?.__typename === 'PricingPercentageValue' &&
    firstDiscount?.percentage;

  return json(
    {
      treatmentOrder: treatment ? treatment.payload : null,
      order,
      lineItems,
      discountValue,
      discountPercentage,
      fulfillmentStatus,
    },
    {
      headers: {
        'Set-Cookie': await context.session.commit(),
      },
    },
  );
}

export default function OrderRoute() {
  const {
    treatmentOrder,
    order,
    lineItems,
    discountValue,
    discountPercentage,
    fulfillmentStatus,
  } = useLoaderData<typeof loader>();

  const productsInOrder = lineItems.filter(
    (p) => p.customAttributes.length === 0,
  );

  const orderLineItemsWithCustomAttributes = lineItems.filter(
    (p) => p.customAttributes.length > 0,
  );

  return (
    <>
      <AccountTitle
        linkBack="/account/orders"
        heading={<>Ordre {order.name}</>}
      />

      <AccountContent>
        <Stack gap="lg">
          <Text c="dimmed" size="sm">
            Købt {format(new Date(order.processedAt!), 'PPPP', {locale: da})}
            <Badge ml="xs">
              {fulfillmentStatus.length > 0 ? fulfillmentStatus[0].status : '-'}
            </Badge>
          </Text>

          {treatmentOrder ? (
            <TreatmentTable
              treatmentOrder={treatmentOrder}
              lineItems={orderLineItemsWithCustomAttributes}
            />
          ) : null}

          {productsInOrder.length > 0 ? (
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
                  {productsInOrder.map((l) => (
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

              {((discountValue && discountValue.amount) ||
                discountPercentage) && (
                <Flex justify="space-between" mb="cs">
                  <Text>Discounts</Text>

                  {discountPercentage ? (
                    <Text>-{discountPercentage}% OFF</Text>
                  ) : (
                    discountValue && <Money data={discountValue!} as={Text} />
                  )}
                </Flex>
              )}

              <Flex justify="space-between" mb="xs">
                <Text>Subtotal</Text>
                <Money data={order.subtotal!} as={Text} />
              </Flex>
              <Flex justify="space-between" mb="xs">
                <Text>Moms</Text>
                <Money data={order.totalTax!} as={Text} />
              </Flex>
              <Flex justify="space-between">
                <Text>Total</Text>
                <Money data={order.totalPrice!} as={Text} />
              </Flex>
            </Card>
            {productsInOrder.length > 0 ? (
              <Card shadow="0" padding="md" radius="md" withBorder>
                <Text fw={500} size="lg" mb="md">
                  Forsendelse
                </Text>
                {order?.shippingAddress ? (
                  <>
                    <Text>{order.shippingAddress.name}</Text>
                    {order?.shippingAddress?.formatted ? (
                      order.shippingAddress.formatted.map((line: string) => (
                        <Text key={line}>{line}</Text>
                      ))
                    ) : (
                      <></>
                    )}
                    {order.shippingAddress.formattedArea ? (
                      <p>{order.shippingAddress.formattedArea}</p>
                    ) : (
                      ''
                    )}
                  </>
                ) : (
                  <Text>Ingen forsendelse</Text>
                )}
              </Card>
            ) : null}
          </SimpleGrid>
        </Stack>
      </AccountContent>
    </>
  );
}

function OrderLineRow({lineItem}: {lineItem: OrderLineItemFullFragment}) {
  return (
    <Table.Tr>
      <Table.Td>
        {lineItem.image && (
          <div>
            <Image data={lineItem.image} width={96} height={96} />
          </div>
        )}
      </Table.Td>
      <Table.Td valign="top" width="100%">
        <Text mb="xs">
          {lineItem.title}{' '}
          {lineItem.variantTitle ? (
            <small>({lineItem.variantTitle})</small>
          ) : null}
        </Text>
      </Table.Td>
      <Table.Td valign="top">
        <Money data={lineItem.totalDiscount!} />
      </Table.Td>
    </Table.Tr>
  );
}

function TreatmentTable({
  treatmentOrder,
  lineItems,
}: {
  treatmentOrder: CustomerOrder;
  lineItems: OrderLineItemFullFragment[];
}) {
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
            {treatmentOrder.line_items.map((treatmentLineItem) => {
              const orderLineItem = lineItems.find((p) =>
                isEqualGid(p.id, treatmentLineItem.id),
              );

              return (
                <TreatmentLineRow
                  key={treatmentLineItem.id}
                  treatmentLineItem={treatmentLineItem}
                  lineItem={orderLineItem!}
                />
              );
            })}
          </Table.Tbody>
        </Table>
      </Card>
    </>
  );
}

function TreatmentLineRow({
  treatmentLineItem,
  lineItem,
}: {
  treatmentLineItem: CustomerOrderLineItem;
  lineItem: OrderLineItemFullFragment;
}) {
  return (
    <Table.Tr>
      <Table.Td>
        <Link to={`/products/`}>
          {lineItem?.image && (
            <div>
              <Image data={lineItem.image} width={96} height={96} />
            </div>
          )}
        </Link>
      </Table.Td>
      <Table.Td valign="top" width="100%">
        <Text mb="xs">{treatmentLineItem.title}</Text>
        {treatmentLineItem.user ? (
          <Text size="sm">
            <strong>Hos: </strong>{' '}
            <Link to={`/${treatmentLineItem.user.username}`}>
              {treatmentLineItem.user?.fullname}
            </Link>
          </Text>
        ) : (
          <Text size="sm">
            <strong>Hos: </strong> <i>Slettet skønhedsekspert</i>
          </Text>
        )}
        <Text size="sm">
          <strong>Tid:</strong>{' '}
          {format(
            new Date(treatmentLineItem.properties.from || ''),
            "EEEE 'd.' d'.' LLL 'kl 'HH:mm",
            {
              locale: da,
            },
          )}
        </Text>

        {treatmentLineItem.shipping ? (
          <Stack gap={rem(4)}>
            <Text size="sm">
              <strong>Location:</strong>{' '}
              {treatmentLineItem.shipping.destination.fullAddress}
            </Text>
            <Text size="xs" c="red" fw={500}>
              Udgifterne bliver beregnet under købsprocessen.
              {treatmentLineItem.shipping.cost.value}{' '}
              {treatmentLineItem.shipping.cost.currency}
            </Text>
          </Stack>
        ) : (
          <>
            <Text size="sm">
              <strong>Location:</strong>{' '}
              {treatmentLineItem.location?.fullAddress}
            </Text>
          </>
        )}
      </Table.Td>
      <Table.Td valign="top">
        <Money data={lineItem.totalDiscount!} />
      </Table.Td>
    </Table.Tr>
  );
}
