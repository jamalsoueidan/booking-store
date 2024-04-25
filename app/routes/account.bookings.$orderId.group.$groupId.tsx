import {
  Card,
  Divider,
  Flex,
  Group,
  Modal,
  Stack,
  Text,
  rem,
} from '@mantine/core';
import {useLoaderData} from '@remix-run/react';
import {Money} from '@shopify/hydrogen';
import {json, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {IconCar, IconStarFilled} from '@tabler/icons-react';
import {differenceInMinutes, format} from 'date-fns';
import {da} from 'date-fns/locale';
import {LocationIcon} from '~/components/LocationIcon';
import {PRODUCT_VARIANT_FRAGMENT} from '~/data/fragments';
import {getBookingShopifyApi} from '~/lib/api/bookingShopifyApi';
import {durationToTime} from '~/lib/duration';
import {getCustomer} from '~/lib/get-customer';

export async function loader({params, context}: LoaderFunctionArgs) {
  const customerId = await getCustomer({context});

  const groupId = params.groupId || '';
  const orderId = params.orderId || '';

  const {payload: order} =
    await getBookingShopifyApi().customerBookingGetByGroup(
      customerId,
      orderId,
      groupId,
    );

  return json({
    order,
  });
}

export default function AccountBookingsShowOrder() {
  const {order} = useLoaderData<typeof loader>();

  const start = order.line_items[0].properties.from;
  const end = order.line_items[order.line_items.length - 1].properties.to;

  return (
    <>
      <Modal.Header>
        <Modal.Title>Order {order.order_number}</Modal.Title>
        <Modal.CloseButton />
      </Modal.Header>
      <Modal.Body>
        <Text size="lg" mb="md" fw="bold">
          Dato & Tid
        </Text>
        {start && end && (
          <>
            <Text size="md" fw={500}>
              {format(new Date(start), 'PPPP', {
                locale: da,
              })}{' '}
            </Text>
            <Text size="md" fw={500}>
              kl.{' '}
              {format(new Date(start), 'HH:mm', {
                locale: da,
              })}
              {' - '}
              {format(new Date(end), 'HH:mm', {
                locale: da,
              })}
            </Text>
            <Text size="xs" c="dimmed" tt="uppercase" fw={500}>
              Behandlingstid:{' '}
              {durationToTime(
                differenceInMinutes(new Date(end), new Date(start)),
              )}
            </Text>
          </>
        )}
        <Divider my="lg" />
        <Text size="lg" mb="md" fw="bold">
          Lokation
        </Text>
        {order.start && order.end && (
          <>
            <Text size="md" fw={500}>
              {format(new Date(order.start), 'PPPP', {
                locale: da,
              })}{' '}
            </Text>
            <Text size="xs" c="dimmed" tt="uppercase" fw={500}>
              Kørselstid:{' '}
              {durationToTime(
                differenceInMinutes(
                  new Date(order.line_items[0].properties.from),
                  new Date(order.start),
                ),
              )}
            </Text>
          </>
        )}

        {order.shipping ? (
          <Stack gap={rem(4)} mt="sm">
            <Card shadow="0" padding="xs" radius="0" withBorder>
              <Flex align="center" gap="xs">
                <LocationIcon location={order.location} />
                <div>
                  <Text size="xs" fw={600}>
                    Kører fra:
                  </Text>{' '}
                  <Text size="xs" c="dimmed">
                    {order.shipping.origin.fullAddress}
                  </Text>
                  {order.start && order.end && (
                    <Text size="xs" fw={500}>
                      kl.{' '}
                      {format(new Date(order.start), 'HH:mm', {
                        locale: da,
                      })}
                    </Text>
                  )}
                </div>
              </Flex>
            </Card>
            <Card shadow="0" padding="xs" radius="0" withBorder>
              <Flex align="center" gap="xs">
                <IconCar
                  style={{width: rem(48), height: rem(48)}}
                  stroke={1.5}
                />
                <div>
                  <Text size="xs" fw="bold">
                    Kører til:
                  </Text>
                  <Text size="xs" c="dimmed">
                    {order.shipping.destination.fullAddress}
                  </Text>
                  {order.start && order.end && (
                    <Text size="xs" fw={500}>
                      kl.
                      {format(
                        new Date(order.line_items[0].properties.from),
                        'HH:mm',
                        {
                          locale: da,
                        },
                      )}
                    </Text>
                  )}
                </div>
              </Flex>
            </Card>
            <Text size="xs" c="red" fw={500}>
              Udgifterne bliver beregnet under købsprocessen.
              {order.shipping.cost.value} {order.shipping.cost.currency}
            </Text>
          </Stack>
        ) : (
          <>
            <Text size="md" fw={500}>
              {order.location?.name} <LocationIcon location={order.location} />
            </Text>
            <Text size="md" fw={500}>
              {order.location?.fullAddress}
            </Text>
          </>
        )}
        <Divider my="lg" />
        <Text size="lg" mb="md" fw="bold">
          Behandling(er):
        </Text>
        {order.line_items.map((lineItem) => {
          return (
            <Group key={lineItem.id}>
              <IconStarFilled
                style={{width: rem(48), height: rem(48)}}
                stroke={1.5}
                color="var(--mantine-color-blue-filled)"
              />
              <div>
                <Text>{lineItem.title}</Text>
                {lineItem.price_set.shop_money && (
                  <Money
                    data={{
                      currencyCode: 'DKK',
                      ...lineItem.price_set.shop_money,
                    }}
                    as={Text}
                  />
                )}
              </div>
            </Group>
          );
        })}
        <Divider my="lg" />
        <Text size="lg" mb="md" fw="bold">
          Kunde:
        </Text>
        {order.customer ? (
          <Group gap="xs">
            <div>
              <Text>
                {order.customer.first_name} {order.customer.last_name}
              </Text>
              {order.customer.phone ? (
                <Text c="dimmed" size="sm">
                  {order.customer.phone}
                </Text>
              ) : (
                <Text c="dimmed" size="sm">
                  Kunde har ikke oplyst telefon-nummer
                </Text>
              )}
            </div>
          </Group>
        ) : null}
      </Modal.Body>
    </>
  );
}

export const PRODUCT_QUERY = `#graphql
  query ProductVariantIds(
    $country: CountryCode
    $language: LanguageCode
    $variantId: [ID!]!
  ) @inContext(country: $country, language: $language) {
    nodes(ids: $variantId){
      ...on ProductVariant{
        ...ProductVariant
      }
    }
  }
  ${PRODUCT_VARIANT_FRAGMENT}
` as const;
