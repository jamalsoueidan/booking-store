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
import {AccountTitle} from '~/components/account/AccountTitle';
import ModalBooking from '~/components/account/ModalBooking';
import {type CustomerOrderList} from '~/lib/api/model';
import {type ApiOrdersLineItem} from './($locale).api.orders.$productId.lineitem.$lineItem';

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

      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        headerToolbar={{
          left: isMobile ? 'prev,next' : 'prev,next today',
          center: 'title',
          right: isMobile ? '' : 'dayGridMonth,timeGridWeek',
        }}
        eventDataTransform={(input: EventInput) => {
          const order = input as unknown as CustomerOrderList;
          input.color = 'green';
          input.display = 'block';
          input.className = 'event-custom';
          if (order.refunds.length > 0) {
            input.color = '#cccccc';
          }
          return input;
        }}
        eventDidMount={(info) => {
          const eventElement = info.el.querySelector(
            '.fc-event-title-container',
          );

          const order = info.event.extendedProps as CustomerOrderList;
          if (eventElement && order.line_items.properties.shippingId) {
            // Create a container for your React component
            const descriptionElement = document.createElement('span');
            descriptionElement.classList.add('fc-event-icon');
            eventElement.prepend(descriptionElement);

            // Use createRoot to render the React component
            const root = createRoot(descriptionElement);
            root.render(<CustomDescription />);
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
        events="/api/orders"
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

      <ModalBooking
        type="booking"
        opened={opened}
        data={fetcher.data}
        close={close}
      />
    </>
  );
}
