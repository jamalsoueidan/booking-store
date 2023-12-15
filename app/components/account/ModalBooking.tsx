import {
  Avatar,
  Divider,
  Flex,
  Group,
  Loader,
  Modal,
  Stack,
  Text,
  Title,
  rem,
} from '@mantine/core';
import {Money} from '@shopify/hydrogen';
import {IconCar} from '@tabler/icons-react';
import {differenceInMinutes, format} from 'date-fns';
import {da} from 'date-fns/locale';
import {durationToTime} from '~/lib/duration';
import {type ApiOrdersLineItem} from '~/routes/($locale).api.orders.$productId.lineitem.$lineItem';

const CustomDescription = () => (
  <IconCar style={{width: rem(24), height: rem(24)}} stroke={1.5} />
);

export default function ModalBooking({
  opened,
  data,
  close,
}: {
  data?: ApiOrdersLineItem;
  opened: boolean;
  close: () => void;
}) {
  return (
    <Modal
      opened={opened}
      onClose={close}
      title={`OrderId: ${data?.order.order_number}`}
      centered
      size="auto"
      withCloseButton
    >
      {data ? <ModalContent data={data} /> : <Loader color="blue" />}
    </Modal>
  );
}

function ModalContent({data}: {data: ApiOrdersLineItem}) {
  const {product, order} = data;
  const from = order.line_items.properties.from;
  const to = order.line_items.properties.to;

  return (
    <>
      <Group>
        <Avatar
          src={product.selectedVariant?.image?.url}
          size="lg"
          radius="md"
        />
        <div>
          <Title order={2}>{product.title}</Title>
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
      {order.line_items.shipping ? (
        <Stack gap={rem(4)}>
          <Flex align="center" gap="xs">
            <CustomDescription />
            <Text size="md" fw={500}>
              {order.line_items.shipping?.destination.fullAddress}
            </Text>
          </Flex>
          <Text size="xs" c="red" fw={500}>
            Udgifterne bliver beregnet under købsprocessen{' '}
            {order.line_items.shipping?.cost.value}{' '}
            {order.line_items.shipping?.cost.currency}
          </Text>
        </Stack>
      ) : (
        <>
          <Text size="md" fw={500}>
            {order.line_items.location.name}
          </Text>
          <Text size="md" fw={500}>
            {order.line_items.location.fullAddress}
          </Text>
        </>
      )}
    </>
  );
}
