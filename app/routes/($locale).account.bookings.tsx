import {type EventInput} from '@fullcalendar/core/index.js';
import daLocale from '@fullcalendar/core/locales/da';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import {
  Avatar,
  Divider,
  Flex,
  Group,
  Modal,
  Stack,
  Text,
  Title,
  rem,
} from '@mantine/core';
import {useDisclosure} from '@mantine/hooks';
import {useFetcher, useNavigate} from '@remix-run/react';
import {Money} from '@shopify/hydrogen';
import {IconCar} from '@tabler/icons-react';
import {differenceInMinutes, format} from 'date-fns';
import {da} from 'date-fns/locale';
import {useState} from 'react';
import {type ProductFragment} from 'storefrontapi.generated';
import type {
  CustomerLocationIsDefault,
  CustomerOrder,
  Shipping,
} from '~/lib/api/model';
import {durationToTime} from '~/lib/duration';

const CustomDescription = () => (
  <IconCar style={{width: rem(24), height: rem(24)}} stroke={1.5} />
);

export default function AccountBookings() {
  const navigate = useNavigate();
  const [opened, {open, close}] = useDisclosure(false);
  const fetcher = useFetcher<{
    product: ProductFragment;
    location: CustomerLocationIsDefault;
    shipping: Shipping;
  }>();
  const [order, setOrder] = useState<CustomerOrder>();
  const openModal = (order: CustomerOrder) => {
    const location = order.line_items.properties.locationId;
    const shippingId = order.line_items.properties.shippingId;

    fetcher.load(
      `/api/orders/${order.line_items.product_id}/lineitem/${order.line_items.id}?locationId=${location}&shippingId=${shippingId}`,
    );
    setOrder(order);
    open();
  };

  const product = fetcher.data?.product;
  const location = fetcher.data?.location;
  const shipping = fetcher.data?.shipping;

  const from = order?.line_items.properties.from;
  const to = order?.line_items.properties.to;

  return (
    <>
      <Title>Bestillinger</Title>
      <Divider my="md" />

      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek',
        }}
        eventDataTransform={(input: EventInput) => {
          const order = input as unknown as CustomerOrder;
          input.color = 'green';
          input.display = 'block';
          input.className = 'event-custom';
          if (order.refunds.length > 0) {
            input.color = '#cccccc';
          }
          return input;
        }}
        themeSystem="standard"
        events="/api/orders"
        initialView="dayGridMonth"
        buttonText={{
          prev: '<',
          next: '>',
        }}
        locale={daLocale}
        firstDay={1}
        slotMinTime={'06:00:00'}
        slotMaxTime={'21:00:00'}
        allDaySlot={false}
        displayEventEnd={true}
        eventTimeFormat={{
          hour: '2-digit',
          minute: '2-digit',
          meridiem: false,
        }}
        eventClick={({event}) => {
          const order = event.extendedProps as CustomerOrder;
          openModal(order);
        }}
      />

      <Modal
        opened={opened}
        onClose={close}
        title={`OrderId: ${order?.order_number}`}
        centered
        withCloseButton
      >
        <Group>
          <Avatar
            src={product?.selectedVariant?.image?.url}
            size="lg"
            radius="md"
          />
          <div>
            <Title order={2}>{order?.line_items?.title}</Title>
            {order?.line_items.price_set.shop_money && (
              <Money
                data={{
                  currencyCode: 'DKK',
                  ...order?.line_items.price_set.shop_money,
                }}
              />
            )}
          </div>
        </Group>
        <Divider my="lg" />
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
              {durationToTime(
                differenceInMinutes(new Date(to), new Date(from)),
              )}
            </Text>
          </>
        )}
        <Divider my="lg" />
        <Text size="lg" mb="md" fw="bold">
          Lokation
        </Text>
        {location?.locationType === 'destination' ? (
          <Stack gap={rem(4)}>
            <Flex align="center" gap="xs">
              <CustomDescription />
              <Text size="md" fw={500}>
                {shipping?.destination.fullAddress}
              </Text>
            </Flex>
            <Text size="xs" c="red" fw={500}>
              Udgifterne bliver beregnet under købsprocessen{' '}
              {shipping?.cost.value} {shipping?.cost.currency}
            </Text>
          </Stack>
        ) : (
          <>
            <Text size="md" fw={500}>
              {location?.name}
            </Text>
            <Text size="md" fw={500}>
              {location?.fullAddress}
            </Text>
          </>
        )}
      </Modal>
    </>
  );
}
