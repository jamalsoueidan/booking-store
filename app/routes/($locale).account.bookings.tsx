import type {EventClickArg, EventInput} from '@fullcalendar/core/index.js';
import daLocale from '@fullcalendar/core/locales/da';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import {Modal, rem} from '@mantine/core';
import {useMediaQuery} from '@mantine/hooks';
import {Outlet, useNavigate, useOutlet} from '@remix-run/react';
import {IconCar} from '@tabler/icons-react';
import {createRoot} from 'react-dom/client';
import {AccountContent} from '~/components/account/AccountContent';
import {AccountTitle} from '~/components/account/AccountTitle';
import type {CustomerBooking} from '~/lib/api/model';

const CustomDescription = () => (
  <IconCar style={{width: rem(24), height: rem(24)}} stroke={1.5} />
);

export default function AccountBookings() {
  const isMobile = useMediaQuery('(max-width: 62em)');
  const navigate = useNavigate();
  const inOutlet = !!useOutlet();

  const openModal = ({event}: EventClickArg) => {
    navigate(`${event.id}/group/${event.groupId}`, {
      relative: 'path',
    });
  };

  const closeModal = () => {
    navigate(-1);
  };

  return (
    <>
      <AccountTitle heading="Bestillinger" />
      <AccountContent>
        <FullCalendar
          customButtons={{
            addVacation: {
              text: 'Tilføj ferie',
              click: () => {
                navigate(`add-vacation`, {
                  relative: 'path',
                });
              },
            },
          }}
          slotDuration={'00:15:00'}
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          headerToolbar={{
            left: isMobile ? 'prev,next' : 'prev,next today',
            center: 'title',
            right: isMobile ? '' : 'addVacation dayGridMonth,timeGridWeek',
          }}
          eventSourceSuccess={(eventsInput: EventInput[]) => {
            const newEvents: EventInput[] = [];
            (eventsInput as unknown as CustomerBooking[]).forEach(
              (event: CustomerBooking) => {
                event.line_items?.forEach((lineItem) => {
                  newEvents.push({
                    title: lineItem.title,
                    start: lineItem.properties.from,
                    end: lineItem.properties.to,
                    id: event.id.toString(),
                    groupId: lineItem.properties.groupId,
                    extendedProps: lineItem,
                  });
                });

                if (event.shipping) {
                  newEvents.push({
                    title: 'Kørsel til kunde',
                    start: event.start,
                    end: event.line_items[0].properties.from,
                    id: event.id.toString(),
                    groupId: event.line_items[0].properties.groupId,
                    extendedProps: event,
                  });
                  newEvents.push({
                    title: 'Kørsel hjem',
                    start:
                      event.line_items[event.line_items.length - 1].properties
                        .to,
                    end: event.end,
                    id: event.id.toString(),
                    groupId: event.line_items[0].properties.groupId,
                    extendedProps: event,
                  });
                }
              },
            );

            return newEvents;
          }}
          eventDataTransform={(input: EventInput) => {
            const order = input.extendedProps as CustomerBooking;
            input.color = 'green';
            input.display = 'block';
            input.className = 'event-custom';
            if (order.shipping) {
              input.color = '#666';
            }
            if (order.refunds?.length > 0) {
              input.color = '#cccccc';
            }
            return input;
          }}
          eventDidMount={(info) => {
            const eventElement = info.el.querySelector(
              '.fc-event-title-container',
            );

            const order = info.event.extendedProps as CustomerBooking;
            if (eventElement && order.shipping) {
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
          eventSources={['/account/api/bookings', '/account/api/booked']}
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
          eventClick={openModal}
        />
      </AccountContent>

      <Modal.Root
        opened={inOutlet}
        onClose={closeModal}
        fullScreen={isMobile}
        centered
      >
        <Modal.Overlay />
        <Modal.Content>
          <Outlet context={{closeModal}} />
        </Modal.Content>
      </Modal.Root>
    </>
  );
}
