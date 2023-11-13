import {Badge, Button, Card, Group, Text} from '@mantine/core';
import {format, formatDuration, intervalToDuration} from 'date-fns';
import {da} from 'date-fns/locale';
import {type CustomerBooking} from '~/lib/api/model';

const statusColor = {
  cancelled: 'pink',
  refunded: 'red',
  fulfilled: 'green',
  onhold: 'yellow',
  unfulfilled: 'gray',
};

export function BookingCard({booking}: {booking: CustomerBooking}) {
  if (!booking?.orderId) return null;

  return (
    <Card shadow="sm" padding="md" radius="md" withBorder>
      <Text size="sm">
        {format(new Date(booking.lineItems[0].from), 'PPPP', {locale: da})}
      </Text>

      {booking.lineItems.map((lineItem) => {
        return (
          <span key={lineItem.from.toString()}>
            <Group justify="space-between" mt="md" mb="xs">
              <Text fw={500}>{lineItem.title}</Text>
              <Badge color={statusColor[lineItem.status]} variant="light">
                {lineItem.status === 'cancelled' ? 'Annulleret' : ''}
                {lineItem.status === 'refunded' ? 'Returneret' : ''}
                {lineItem.status === 'fulfilled' ? 'Fuldført' : ''}
                {lineItem.status === 'onhold' ? 'På hold' : ''}
                {lineItem.status === 'unfulfilled' ? 'Ikke behandlet' : ''}
              </Badge>
            </Group>
            <Text size="sm" c="dimmed">
              Tid:{' '}
              {format(new Date(lineItem.from), 'p', {
                locale: da,
              })}
            </Text>
            <Text size="sm" c="dimmed">
              Varighed:{' '}
              {formatDuration(
                intervalToDuration({
                  start: new Date(lineItem.to),
                  end: new Date(lineItem.from),
                }),
                {locale: da},
              )}
            </Text>
            <Text size="sm" c="dimmed">
              Kunde: {booking.buyer.fullName}
            </Text>
            <Button variant="light" color="blue" fullWidth mt="md" radius="md">
              action
            </Button>
          </span>
        );
      })}
    </Card>
  );
}
