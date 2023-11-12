import {Text, Title} from '@mantine/core';
import {Link} from '@remix-run/react';
import {format, formatDuration, intervalToDuration} from 'date-fns';
import {da} from 'date-fns/locale';
import {CustomerBooking} from '~/lib/api/model';

export function BookingCard({booking}: {booking: CustomerBooking}) {
  if (!booking?.orderId) return null;

  return (
    <li className="flex-col text-center border rounded">
      <Link
        className="block w-full text-center"
        to={`/account/bookings/${booking.orderId}`}
        prefetch="intent"
      >
        <div className="border-b p-2">
          <Text color="subtle" className="ml-3">
            {format(new Date(booking.lineItems[0].from), 'PPPP', {locale: da})}
          </Text>
        </div>
        {booking.lineItems.map((lineItem) => {
          return (
            <div
              key={lineItem.from.toString()}
              className="flex-col justify-center text-left p-4 flex-grow"
            >
              <Title>{lineItem.title}</Title>
              <dl className="grid grid-gap-1">
                <dt className="sr-only">Klokken</dt>
                <dd>
                  <Text size="fine" color="subtle">
                    Tid:{' '}
                    {format(new Date(lineItem.from), 'p', {
                      locale: da,
                    })}
                  </Text>
                </dd>
                <dt className="sr-only">Order Date</dt>
                <dd>
                  <Text size="fine" color="subtle">
                    Varighed:{' '}
                    {formatDuration(
                      intervalToDuration({
                        start: new Date(lineItem.to),
                        end: new Date(lineItem.from),
                      }),
                      {locale: da},
                    )}
                  </Text>
                </dd>
                <dd>
                  <Text size="fine" color="subtle">
                    Kunde: {booking.buyer.fullName}
                  </Text>
                </dd>
                <dt className="sr-only">Fulfillment Status</dt>
                <dd className="mt-2">
                  <span
                    className={`px-3 py-1 text-xs font-medium rounded-full ${
                      lineItem.status === 'fulfilled'
                        ? 'bg-green-100 text-green-800'
                        : ''
                    } ${
                      lineItem.status === 'cancelled'
                        ? 'bg-red-100 text-red-800'
                        : ''
                    } ${
                      lineItem.status === 'onhold'
                        ? 'bg-yellow-100 text-yellow-800'
                        : ''
                    } ${
                      lineItem.status === 'refunded'
                        ? 'bg-orange-100 text-orange-800'
                        : ''
                    } ${
                      lineItem.status === 'unfulfilled'
                        ? 'bg-primary/5 text-primary/50'
                        : ''
                    }`}
                  >
                    <Text size="fine">
                      {lineItem.status === 'cancelled' ? 'Annulleret' : ''}
                      {lineItem.status === 'refunded' ? 'Returneret' : ''}
                      {lineItem.status === 'fulfilled' ? 'Fuldført' : ''}
                      {lineItem.status === 'onhold' ? 'På hold' : ''}
                      {lineItem.status === 'unfulfilled'
                        ? 'Ikke behandlet'
                        : ''}
                    </Text>
                  </span>
                </dd>
              </dl>
            </div>
          );
        })}
      </Link>
    </li>
  );
}
