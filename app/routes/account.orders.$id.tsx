import {
  Badge,
  Card,
  Container,
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
import {Trans, useTranslation} from 'react-i18next';
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
import {useDate} from '~/lib/duration';
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
  const {t} = useTranslation(['account'], {keyPrefix: 'orders.id'});
  const {format} = useDate();

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
    <Container size="md" my={{base: rem(80), sm: rem(100)}}>
      <AccountTitle
        linkBack="/account/orders"
        heading={<>{t('title', {name: order.name})}</>}
      />

      <AccountContent>
        <Stack gap="lg">
          <Text c="dimmed" size="sm">
            {t('bought')} {format(new Date(order.processedAt!), 'PPPP')}
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
                {t('products')}:
              </Title>
              <Table>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th visibleFrom="sm">{t('image')}:</Table.Th>
                    <Table.Th>{t('description')}</Table.Th>
                    <Table.Th> {t('total')}</Table.Th>
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
                {t('summary')}
              </Text>

              {((discountValue && discountValue.amount) ||
                discountPercentage) && (
                <Flex justify="space-between" mb="cs">
                  <Text>{t('discount')}</Text>

                  {discountPercentage ? (
                    <Text>-{discountPercentage}% OFF</Text>
                  ) : (
                    discountValue && <Money data={discountValue!} as={Text} />
                  )}
                </Flex>
              )}

              <Flex justify="space-between" mb="xs">
                <Text>{t('subtotal')}</Text>
                <Money data={order.subtotal!} as={Text} />
              </Flex>
              <Flex justify="space-between" mb="xs">
                <Text>{t('tax')}</Text>
                <Money data={order.totalTax!} as={Text} />
              </Flex>
              <Flex justify="space-between">
                <Text>{t('total')}</Text>
                <Money data={order.totalPrice!} as={Text} />
              </Flex>
            </Card>
            {productsInOrder.length > 0 ? (
              <Card shadow="0" padding="md" radius="md" withBorder>
                <Text fw={500} size="lg" mb="md">
                  {t('shipping')}
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
                  <Text>{t('no_shipping')}</Text>
                )}
              </Card>
            ) : null}
          </SimpleGrid>
        </Stack>
      </AccountContent>
    </Container>
  );
}

function OrderLineRow({lineItem}: {lineItem: OrderLineItemFullFragment}) {
  return (
    <Table.Tr>
      <Table.Td visibleFrom="sm">
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
  const {t} = useTranslation(['account'], {keyPrefix: 'orders.id'});
  if (treatmentOrder.line_items.length === 0) return null;

  return (
    <>
      <Card withBorder>
        <Title order={3} mb="md">
          {t('treatments')}
        </Title>
        <Table>
          <Table.Thead>
            <Table.Tr>
              <Table.Th visibleFrom="sm">{t('image')}:</Table.Th>
              <Table.Th>{t('details')}:</Table.Th>
              <Table.Th>{t('total')}</Table.Th>
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
  const {format} = useDate();
  const {t} = useTranslation(['account'], {keyPrefix: 'orders.id'});
  return (
    <Table.Tr>
      <Table.Td visibleFrom="sm">
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
          <Text
            size="sm"
            component={Trans}
            i18nKey="account:orders.id.visiting"
            values={{name: treatmentLineItem.user.fullname}}
            components={[
              <Link to={`/${treatmentLineItem.user.username}`} key={0}>
                {treatmentLineItem.user.fullname}
              </Link>,
            ]}
          />
        ) : (
          t('visiting_deleted')
        )}
        <Text size="sm">
          <strong>{t('time')}:</strong>{' '}
          {format(
            new Date(treatmentLineItem.properties.from || ''),
            "EEEE 'd.' d'.' LLL 'kl 'HH:mm",
          )}
        </Text>

        {treatmentLineItem.shipping ? (
          <Stack gap={rem(4)}>
            <Text size="sm">
              <strong>{t('location')}:</strong>{' '}
              {treatmentLineItem.shipping.destination.fullAddress}
            </Text>
            <Text size="xs" c="red" fw={500}>
              {t('location_expenses')}
              {treatmentLineItem.shipping.cost.value}{' '}
              {treatmentLineItem.shipping.cost.currency}
            </Text>
          </Stack>
        ) : (
          <>
            <Text size="sm">
              <strong>{t('location')}:</strong>{' '}
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
