import {
  Avatar,
  Divider,
  Flex,
  Group,
  Loader,
  Stack,
  Text,
  rem,
} from '@mantine/core';
import {Money} from '@shopify/hydrogen';
import {IconBuilding, IconCar, IconHome} from '@tabler/icons-react';
import {differenceInMinutes, format} from 'date-fns';
import {da} from 'date-fns/locale';
import {durationToTime} from '~/lib/duration';
import {type ApiOrdersLineItem} from '~/routes/($locale).api.orders.$productId.lineitem.$lineItem';
import MobileModal from '../MobileModal';

const CustomDescription = () => (
  <IconCar style={{width: rem(24), height: rem(24)}} stroke={1.5} />
);

export default function ModalBooking({
  opened,
  data,
  close,
  type,
}: {
  data?: ApiOrdersLineItem;
  opened: boolean;
  close: () => void;
  type: 'booking' | 'order';
}) {
  return (
    <MobileModal
      opened={opened}
      onClose={close}
      title={`OrderId: ${data?.order.order_number}`}
      size="lg"
    >
      {data ? (
        <ModalContent data={data} type={type} />
      ) : (
        <Loader color="blue" />
      )}
    </MobileModal>
  );
}

function ModalContent({
  data,
  type,
}: {
  data: ApiOrdersLineItem;
  type: 'booking' | 'order';
}) {
  const {product, order} = data;
  const from = order.line_items.properties.from;
  const to = order.line_items.properties.to;

  const {location, user, shipping} = order.line_items;

  return (
    <>
      <Text size="lg" mb="md" fw="bold">
        Behandling:
      </Text>
      <Group>
        <Avatar
          src={product.selectedVariant?.image?.url}
          size="md"
          radius="sm"
        />
        <div>
          <Text>{product.title}</Text>
          {order.line_items.price_set.shop_money && (
            <Money
              data={{
                currencyCode: 'DKK',
                ...order.line_items.price_set.shop_money,
              }}
            />
          )}
        </div>
      </Group>
      <Divider my="lg" />
      {type === 'booking' ? (
        <>
          <Text size="lg" mb="md" fw="bold">
            Kunde:
          </Text>
          {order.customer ? (
            <Group gap="xs">
              <div>
                <Text>
                  {order.customer.first_name} {order.customer.last_name}
                </Text>
                <Text c="dimmed" size="sm">
                  {order.customer.phone}
                </Text>
              </div>
            </Group>
          ) : null}
          <Divider my="lg" />
        </>
      ) : null}
      {type === 'order' ? (
        <>
          <Text size="lg" mb="md" fw="bold">
            Skønhedsekspert:
          </Text>
          {user ? (
            <Group gap="xs">
              {user.images.profile?.url ? (
                <Avatar src={user.images.profile?.url} size="md" radius="sm" />
              ) : null}
              <div>
                <Text>{user.fullname}</Text>
                <Text c="dimmed" size="sm">
                  {user.shortDescription}
                </Text>
              </div>
            </Group>
          ) : null}
          <Divider my="lg" />
        </>
      ) : null}
      <Text size="lg" mb="md" fw="bold">
        Dato & Tid
      </Text>
      {from && to && (
        <>
          <Text size="md" fw={500}>
            {format(new Date(from), 'PPPP', {
              locale: da,
            })}{' '}
          </Text>
          <Text size="md" fw={500}>
            kl.{' '}
            {format(new Date(from), 'HH:mm', {
              locale: da,
            })}
            {' - '}
            {format(new Date(to), 'HH:mm', {
              locale: da,
            })}
          </Text>
          <Text size="xs" c="dimmed" tt="uppercase" fw={500}>
            {durationToTime(differenceInMinutes(new Date(to), new Date(from)))}
          </Text>
        </>
      )}
      <Divider my="lg" />
      <Text size="lg" mb="md" fw="bold">
        Lokation
      </Text>
      {shipping ? (
        <Stack gap={rem(4)}>
          <Flex align="center" gap="xs">
            <CustomDescription />
            <Text size="md" fw={500}>
              {shipping.destination.fullAddress}
            </Text>
          </Flex>
          <Text size="xs" c="red" fw={500}>
            Udgifterne bliver beregnet under købsprocessen.
            {shipping.cost.value} {shipping.cost.currency}
          </Text>
        </Stack>
      ) : (
        <>
          <Text size="md" fw={500}>
            {location?.name}{' '}
            {location?.originType === 'home' ? <IconHome /> : <IconBuilding />}
          </Text>
          <Text size="md" fw={500}>
            {location?.fullAddress}
          </Text>
        </>
      )}
    </>
  );
}
