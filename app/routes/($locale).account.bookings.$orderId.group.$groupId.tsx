import {Avatar, Divider, Flex, Group, Stack, Text, rem} from '@mantine/core';
import {useLoaderData} from '@remix-run/react';
import {Money, parseGid} from '@shopify/hydrogen';
import {json, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {IconBuilding, IconCar, IconHome} from '@tabler/icons-react';
import {differenceInMinutes, format} from 'date-fns';
import {da} from 'date-fns/locale';
import {PRODUCT_VARIANT_FRAGMENT} from '~/data/fragments';
import {getBookingShopifyApi} from '~/lib/api/bookingShopifyApi';
import {durationToTime} from '~/lib/duration';
import {getCustomer} from '~/lib/get-customer';

export async function loader({params, context}: LoaderFunctionArgs) {
  const customer = await getCustomer({context});

  const groupId = params.groupId || '';
  const orderId = params.orderId || '';

  const {payload: order} =
    await getBookingShopifyApi().customerBookingGetByGroup(
      parseGid(customer.id).id,
      orderId,
      groupId,
    );

  const {nodes: selectedVariants} = await context.storefront.query(
    PRODUCT_QUERY,
    {
      variables: {
        variantId: order.line_items.map(
          (item) => `gid://shopify/ProductVariant/${item.variant_id}`,
        ),
      },
    },
  );

  return json({
    order,
    selectedVariants,
  });
}

const CustomDescription = () => (
  <IconCar style={{width: rem(24), height: rem(24)}} stroke={1.5} />
);

export default function AccountBookingsShowOrder() {
  const {order, selectedVariants} = useLoaderData<typeof loader>();

  const start = order.line_items[0].properties.from;
  const end = order.line_items[order.line_items.length - 1].properties.to;

  return (
    <>
      <Text size="lg" mb="md" fw="bold">
        Behandling(er):
      </Text>
      {order.line_items.map((lineItem) => {
        const variant = selectedVariants.find(
          (variant) =>
            parseGid(variant?.id || '').id === lineItem.variant_id.toString(),
        );

        return (
          <Group key={lineItem.id}>
            <Avatar src={variant?.image?.url} size="md" radius="sm" />
            <div>
              <Text>{variant?.product.title}</Text>
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
      <Divider my="lg" />
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
      {order.shipping ? (
        <Stack gap={rem(4)}>
          <Flex align="center" gap="xs">
            <CustomDescription />
            <Text size="md" fw={500}>
              Kører fra: {order.shipping.origin.fullAddress}
            </Text>
          </Flex>
          <Flex align="center" gap="xs">
            <CustomDescription />
            <Text size="md" fw={500}>
              Kører til: {order.shipping.destination.fullAddress}
            </Text>
          </Flex>
          {order.start && order.end && (
            <>
              <Text size="md" fw={500}>
                {format(new Date(order.start), 'PPPP', {
                  locale: da,
                })}{' '}
              </Text>
              <Text size="md" fw={500}>
                kl.{' '}
                {format(new Date(order.start), 'HH:mm', {
                  locale: da,
                })}
                {' - '}
                {format(
                  new Date(order.line_items[0].properties.from),
                  'HH:mm',
                  {
                    locale: da,
                  },
                )}
              </Text>
              <Text size="xs" c="dimmed" tt="uppercase" fw={500}>
                {durationToTime(
                  differenceInMinutes(
                    new Date(order.line_items[0].properties.from),
                    new Date(order.start),
                  ),
                )}
              </Text>
            </>
          )}
          <Text size="xs" c="red" fw={500}>
            Udgifterne bliver beregnet under købsprocessen.
            {order.shipping.cost.value} {order.shipping.cost.currency}
          </Text>
        </Stack>
      ) : (
        <>
          <Text size="md" fw={500}>
            {order.location?.name}{' '}
            {order.location?.originType === 'home' ? (
              <IconHome />
            ) : (
              <IconBuilding />
            )}
          </Text>
          <Text size="md" fw={500}>
            {order.location?.fullAddress}
          </Text>
        </>
      )}
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
