import {type EventInput} from '@fullcalendar/core/index.js';
import daLocale from '@fullcalendar/core/locales/da';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import {rem} from '@mantine/core';
import {useDisclosure, useMediaQuery} from '@mantine/hooks';
import {useFetcher} from '@remix-run/react';
import {IconCar} from '@tabler/icons-react';
import {createRoot} from 'react-dom/client';
import {AccountContent} from '~/components/account/AccountContent';
import {AccountTitle} from '~/components/account/AccountTitle';
import ModalBooking from '~/components/account/ModalBooking';
import type {CustomerOrderList, CustomerOrderShipping} from '~/lib/api/model';
import {type ApiOrdersLineItem} from './($locale).api.orders.$productId.lineitem.$lineItem';

// Type guard for CustomerOrderList
function isCustomerOrderList(
  order: CustomerOrderList | CustomerOrderShipping,
): order is CustomerOrderList {
  return (order as CustomerOrderList).refunds !== undefined;
}

// Type guard for CustomerOrderShipping
function isCustomerOrderShipping(
  order: CustomerOrderList | CustomerOrderShipping,
): order is CustomerOrderShipping {
  return (order as CustomerOrderShipping).shipping !== undefined;
}

const CustomDescription = () => (
  <IconCar style={{width: rem(24), height: rem(24)}} stroke={1.5} />
);

export default function AccountBookings() {
  const [opened, {open, close}] = useDisclosure(false);
  const fetcher = useFetcher<ApiOrdersLineItem>();
  const isMobile = useMediaQuery('(max-width: 62em)');

  const openModal = (order: CustomerOrderList) => {
    fetcher.load(
      `/api/orders/${order.line_items.product_id}/lineitem/${order.line_items.id}`,
    );
    open();
  };

  return (
    <>
      <AccountTitle heading="Bestillinger" />
      <AccountContent>
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          headerToolbar={{
            left: isMobile ? 'prev,next' : 'prev,next today',
            center: 'title',
            right: isMobile ? '' : 'dayGridMonth,timeGridWeek',
          }}
          eventDataTransform={(input: EventInput) => {
            const order = input as unknown as
              | CustomerOrderList
              | CustomerOrderShipping;
            input.color = 'green';
            input.display = 'block';
            input.className = 'event-custom';
            if (isCustomerOrderList(order)) {
              if (order.refunds?.length > 0) {
                input.color = '#cccccc';
              }
            } else if (isCustomerOrderShipping(order)) {
              input.color = '#c6c6c6';
              input.title = 'Kørsel';
            }
            return input;
          }}
          eventDidMount={(info) => {
            const eventElement = info.el.querySelector(
              '.fc-event-title-container',
            );

            const order = info.event.extendedProps as unknown as
              | CustomerOrderList
              | CustomerOrderShipping;
            const orderHasShippingId =
              isCustomerOrderList(order) &&
              order.line_items?.properties?.shippingId;
            const isShippingEvent = isCustomerOrderShipping(order);

            if (eventElement) {
              if (orderHasShippingId || isShippingEvent) {
                // Create a container for your React component
                const descriptionElement = document.createElement('span');
                descriptionElement.classList.add('fc-event-icon');
                eventElement.prepend(descriptionElement);

                // Use createRoot to render the React component
                const root = createRoot(descriptionElement);
                root.render(<CustomDescription />);
              }
            }
          }}
          eventWillUnmount={(info) => {
            const descriptionElement = info.el.querySelector(
              '.fc-event-title-container > div',
            );
            if (descriptionElement) {
              // Clean up the React component
              const root = createRoot(descriptionElement);
              root.unmount();
            }
          }}
          themeSystem="standard"
          eventSources={['/api/orders', '/api/shippings']}
          initialView={isMobile ? 'timeGridDay' : 'dayGridMonth'}
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
          height="auto"
          eventClick={({event}) => {
            const order = event.extendedProps as CustomerOrderList;
            openModal(order);
          }}
        />
      </AccountContent>
      <ModalBooking
        type="booking"
        opened={opened}
        data={fetcher.data}
        close={close}
      />
    </>
  );
}
