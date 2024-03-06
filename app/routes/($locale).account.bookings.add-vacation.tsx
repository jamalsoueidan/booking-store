import {conform, useForm, useInputEvent} from '@conform-to/react';
import {parse} from '@conform-to/zod';
import {
  ActionIcon,
  FocusTrap,
  Group,
  Modal,
  Stack,
  Text,
  TextInput,
  rem,
} from '@mantine/core';
import {DateInput, TimeInput, type DateValue} from '@mantine/dates';
import {Form, useActionData, useLoaderData} from '@remix-run/react';
import {parseGid} from '@shopify/hydrogen';
import {json, redirect, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {IconClock} from '@tabler/icons-react';
import {add, format, set} from 'date-fns';
import {da} from 'date-fns/locale';
import {useRef, useState} from 'react';
import type {ActionFunctionArgs} from 'react-router';
import {SubmitButton} from '~/components/form/SubmitButton';
import {getBookingShopifyApi} from '~/lib/api/bookingShopifyApi';
import {getCustomer} from '~/lib/get-customer';
import {redirectWithNotification} from '~/lib/show-notification';
import {customerBlockedCreateBody} from '~/lib/zod/bookingShopifyApi';

const schema = customerBlockedCreateBody;

export async function loader({context}: LoaderFunctionArgs) {
  const customerAccessToken = await context.session.get('customerAccessToken');
  if (!customerAccessToken) {
    return redirect('/account/login');
  }
  return json({
    title: null,
    start: null,
    end: null,
  });
}

export const action = async ({request, context}: ActionFunctionArgs) => {
  const customer = await getCustomer({context});

  const formData = await request.formData();
  const submission = parse(formData, {schema});

  if (submission.intent !== 'submit' || !submission.value) {
    return json(submission);
  }

  try {
    await getBookingShopifyApi().customerBlockedCreate(
      parseGid(customer.id).id,
      submission.value,
    );

    return redirectWithNotification(context, {
      redirectUrl: `/account/bookings`,
      title: 'Ferie',
      message: 'Ferie er nu tilføjet!',
      color: 'green',
    });
  } catch (error) {
    return json(submission);
  }
};

export default function AccountBookings() {
  const lastSubmission = useActionData<typeof action>();
  const defaultValue = useLoaderData<typeof loader>();

  const [form, {title, start, end}] = useForm({
    lastSubmission,
    defaultValue,
    onValidate({formData}) {
      return parse(formData, {
        schema,
      });
    },
    shouldValidate: 'onSubmit',
    shouldRevalidate: 'onInput',
  });

  const startTimerRef = useRef<HTMLInputElement>(null);
  const startTimerControl = (
    <ActionIcon
      variant="subtle"
      color="gray"
      onClick={() => startTimerRef.current?.showPicker()}
    >
      <IconClock style={{width: rem(16), height: rem(16)}} stroke={1.5} />
    </ActionIcon>
  );

  const endTimerRef = useRef<HTMLInputElement>(null);
  const endTimeControl = (
    <ActionIcon
      variant="subtle"
      color="gray"
      onClick={() => endTimerRef.current?.showPicker()}
    >
      <IconClock style={{width: rem(16), height: rem(16)}} stroke={1.5} />
    </ActionIcon>
  );

  const startInputRef = useRef<HTMLInputElement>(null);
  const startControl = useInputEvent({
    ref: startInputRef,
  });

  const [startTime, setStartTime] = useState<Date | undefined>(undefined);
  const [endTime, setEndTime] = useState<Date | undefined>(undefined);

  const endInputRef = useRef<HTMLInputElement>(null);
  const endControl = useInputEvent({
    ref: endInputRef,
  });

  return (
    <>
      <Modal.Header>
        <Modal.Title>Tilføj ferie</Modal.Title>
        <Modal.CloseButton />
      </Modal.Header>
      <Modal.Body>
        <FocusTrap active={true}>
          <Form method="POST" {...form.props}>
            <Stack>
              <TextInput
                label="Title"
                autoComplete="off"
                placeholder="Vinterferie?"
                {...conform.input(title)}
                data-autofocus
              />
              <Group>
                <input
                  ref={startInputRef}
                  {...conform.input(start, {hidden: true})}
                />
                <DateInput
                  onChange={(startDate: DateValue) => {
                    if (startDate) {
                      startControl.change(startDate.toJSON());
                      setStartTime(startDate);

                      const endDate = add(startDate, {hours: 24});
                      endControl.change(endDate.toJSON());
                      setEndTime(endDate);
                    }
                  }}
                  value={startTime}
                  label="Start dato"
                  style={{flex: 1}}
                  locale="da"
                  clearable
                />
                <input
                  ref={endInputRef}
                  {...conform.input(end, {hidden: true})}
                />
                <DateInput
                  onChange={(endDate: DateValue) => {
                    if (endDate) {
                      setEndTime(endDate);
                      endControl.change(endDate.toJSON());
                    }
                  }}
                  value={endTime}
                  label="Slut dato"
                  style={{flex: 1}}
                  locale="da"
                />
              </Group>
              <Group>
                <TimeInput
                  label="Start tid"
                  ref={startTimerRef}
                  rightSection={startTimerControl}
                  style={{flex: 1}}
                  value={
                    startTime
                      ? format(startTime, 'HH:mm', {locale: da})
                      : '00:00'
                  }
                  onChange={({
                    currentTarget,
                  }: React.ChangeEvent<HTMLInputElement>) => {
                    if (startTime && currentTarget.value) {
                      const [hours, minutes] = currentTarget.value
                        .split(':')
                        .map(Number);

                      const newTime = set(startTime, {
                        hours,
                        minutes,
                      });
                      setStartTime(newTime);
                      startControl.change(newTime.toJSON());
                    }
                  }}
                />
                <TimeInput
                  label="Slut tid"
                  ref={endTimerRef}
                  rightSection={endTimeControl}
                  style={{flex: 1}}
                  value={
                    endTime ? format(endTime, 'HH:mm', {locale: da}) : '00:00'
                  }
                  onChange={({
                    currentTarget,
                  }: React.ChangeEvent<HTMLInputElement>) => {
                    if (endTime && currentTarget.value) {
                      const [hours, minutes] = currentTarget.value
                        .split(':')
                        .map(Number);

                      const newTime = set(endTime, {
                        hours,
                        minutes,
                      });
                      setEndTime(newTime);
                      endControl.change(newTime.toJSON());
                    }
                  }}
                />
              </Group>
              {startTime || endTime ? (
                <Text size="sm">
                  {startTime && (
                    <>
                      Din ferie start{' '}
                      {format(startTime, "PPPP 'kl.' HH:mm B", {locale: da})}
                    </>
                  )}
                  <br />
                  {endTime && (
                    <>
                      Slutter{' '}
                      {format(endTime, "PPP 'kl.' HH:mm B", {locale: da})}
                    </>
                  )}
                </Text>
              ) : (
                <></>
              )}
              <SubmitButton>Tilføj ferie</SubmitButton>
            </Stack>
          </Form>
        </FocusTrap>
      </Modal.Body>
    </>
  );
}
