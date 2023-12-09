import {Badge, Card, Group, Text} from '@mantine/core';
import {format, formatDuration, intervalToDuration} from 'date-fns';
import {da} from 'date-fns/locale';
import {type CustomerOrder} from '~/lib/api/model';

export function BookingCard({booking}: {booking: CustomerOrder}) {
  const from = booking.line_items.properties.find(
    (p) => p.name === '_from',
  )?.value;

  const to = booking.line_items.properties.find((p) => p.name === '_to')?.value;

  return (
    <Card shadow="sm" padding="md" radius="md" withBorder>
      <Text size="sm">
        {format(new Date(from || ''), 'PPPP', {locale: da})}
      </Text>

      <Group justify="space-between" mt="md" mb="xs">
        <Text fw={500}>{booking.line_items.name}</Text>
        <Badge color="blue" variant="light">
          {booking.refunds.length > 0 && 'Refunderet'}
          {booking.fulfillments.length > 0 && 'Fuldført'}
        </Badge>
      </Group>
      <Text size="sm" c="dimmed">
        Tid:{' '}
        {format(new Date(from || ''), 'p', {
          locale: da,
        })}
      </Text>
      <Text size="sm" c="dimmed">
        Varighed:{' '}
        {formatDuration(
          intervalToDuration({
            start: new Date(to || ''),
            end: new Date(from || ''),
          }),
          {locale: da},
        )}
      </Text>
      <Text size="sm" c="dimmed">
        Kunde: {booking.customer.first_name} {booking.customer.last_name}
      </Text>
    </Card>
  );
}
