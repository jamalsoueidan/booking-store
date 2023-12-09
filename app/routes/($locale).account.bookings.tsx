import {Button, Divider, Group, SimpleGrid, Title} from '@mantine/core';
import {Link, useLoaderData} from '@remix-run/react';
import {json, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {BookingCard} from '~/components/BookingCard';
import {getBookingShopifyApi} from '~/lib/api/bookingShopifyApi';
import {type CustomerOrder} from '~/lib/api/model';
import {getCustomer} from '~/lib/get-customer';

export async function loader({context}: LoaderFunctionArgs) {
  const customer = await getCustomer({context});
  const {payload: bookings} = await getBookingShopifyApi().customerOrderList(
    customer.id,
    2023,
    12,
  );

  return json(bookings);
}

export default function AccountBookings() {
  const bookings = useLoaderData<CustomerOrder[]>();

  return (
    <>
      <Title>Bestillinger</Title>
      <Group mt="md">
        <Button component={Link} to="?mode=upcoming" radius="xl" size="md">
          Kommende bestillinger
        </Button>
        <Button component={Link} to="?mode=completed" radius="xl" size="md">
          Gamle bestillinger
        </Button>
      </Group>
      <Divider my="md" />

      <SimpleGrid cols={3}>
        {bookings.map((booking) => (
          <BookingCard key={booking.id} booking={booking} />
        ))}
      </SimpleGrid>
    </>
  );
}
