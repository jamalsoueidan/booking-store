import {Button, Divider, Group, SimpleGrid, Text, Title} from '@mantine/core';
import {Link, useLoaderData} from '@remix-run/react';
import {json, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {BookingCard} from '~/components/BookingCard';
import {getBookingShopifyApi} from '~/lib/api/bookingShopifyApi';
import type {CustomerBooking, CustomerBookingsListMode} from '~/lib/api/model';
import {getCustomer} from '~/lib/get-customer';

export async function loader({request, context}: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const searchParams = url.searchParams;
  const customer = await getCustomer({context});
  const response = await getBookingShopifyApi().customerBookingsList(
    customer.id,
    {
      mode:
        (searchParams.get('mode') as CustomerBookingsListMode) || 'upcoming',
    },
  );

  return json({
    bookings: response.payload,
  });
}

export default function AccountBookings() {
  const {bookings} = useLoaderData<typeof loader>();

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

      {bookings && (
        <AccountBookingHistory
          bookings={bookings as unknown as CustomerBooking[]}
        />
      )}
    </>
  );
}

function AccountBookingHistory({bookings}: {bookings: CustomerBooking[]}) {
  return bookings?.length ? (
    <Bookings bookings={bookings} />
  ) : (
    <EmptyBookings />
  );
}

function EmptyBookings() {
  return (
    <div>
      <Text>Du har ingen bestilinger</Text>
    </div>
  );
}

function Bookings({bookings}: {bookings: CustomerBooking[]}) {
  return (
    <SimpleGrid cols={3}>
      {bookings.map((booking) => (
        <BookingCard booking={booking} key={booking.orderId} />
      ))}
    </SimpleGrid>
  );
}
