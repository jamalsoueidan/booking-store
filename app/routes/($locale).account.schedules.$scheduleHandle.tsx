import {Form, Link, useActionData, useLoaderData} from '@remix-run/react';
import {
  json,
  redirect,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
} from '@shopify/remix-oxygen';

import type {z} from 'zod';
import {getBookingShopifyApi} from '~/lib/api/bookingShopifyApi';

import {
  conform,
  useFieldList,
  useFieldset,
  useForm,
  type FieldConfig,
} from '@conform-to/react';
import {parse} from '@conform-to/zod';
import {
  ActionIcon,
  Checkbox,
  Divider,
  Flex,
  Select,
  SimpleGrid,
  Table,
  Title,
  rem,
} from '@mantine/core';
import {IconArrowLeft, IconPlus} from '@tabler/icons-react';
import {addMinutes, format, set} from 'date-fns';
import {useState} from 'react';
import {SubmitButton} from '~/components/form/SubmitButton';
import {CustomerScheduleSlotDay, type CustomerSchedule} from '~/lib/api/model';
import {getCustomer} from '~/lib/get-customer';
import {customerScheduleSlotUpdateResponse} from '~/lib/zod/bookingShopifyApi';

// this must be taken from bookingApi, if it doesn't exist, create it in booking-api
const schema = customerScheduleSlotUpdateResponse.shape.payload;

export const action = async ({
  request,
  context,
  params,
}: ActionFunctionArgs) => {
  const customer = await getCustomer({context});

  const {scheduleHandle} = params;
  if (!scheduleHandle) {
    throw new Error('missing scheduleHandler');
  }

  const formData = await request.formData();
  const submission = parse(formData, {
    schema,
  });

  if (submission.intent !== 'submit' || !submission.value) {
    return json(submission);
  }

  const slotsWithIntervals = submission.value.slots.filter(
    ({intervals}) => intervals && intervals.length > 0,
  );

  try {
    const response = await getBookingShopifyApi().customerScheduleSlotUpdate(
      customer.id,
      scheduleHandle,
      slotsWithIntervals as never,
    );

    return redirect(`/account/schedules/${response.payload._id}`);
  } catch (error) {
    return json(submission);
  }
};

export async function loader({context, params}: LoaderFunctionArgs) {
  const customer = await getCustomer({context});

  const {scheduleHandle} = params;
  if (!scheduleHandle) {
    throw new Error('Missing productHandle param, check route filename');
  }

  const response = await getBookingShopifyApi().customerScheduleGet(
    customer.id,
    scheduleHandle || '',
  );

  const days = Object.values(CustomerScheduleSlotDay);

  // ensure all days exists in slots, so user can toggle on/off
  const slots = days
    .map((day) => {
      const existingSlot = response.payload.slots.find(
        (slot) => slot.day === day,
      );
      return existingSlot || {day, intervals: []};
    })
    .sort((a, b) => {
      return days.indexOf(a.day) - days.indexOf(b.day);
    });

  return json<CustomerSchedule>({...response.payload, slots});
}

export default function AccountSchedules() {
  const defaultValue = useLoaderData<typeof loader>();
  const lastSubmission = useActionData<typeof action>();

  const [form, fields] = useForm({
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

  const slots = useFieldList(form.ref, fields.slots);

  return (
    <>
      <Flex direction={'row'} align={'center'}>
        <Link to="/account/schedules">
          <ActionIcon
            variant="transparent"
            size="xl"
            aria-label="Back"
            color="black"
          >
            <IconArrowLeft style={{width: '70%', height: '70%'}} stroke={1.5} />
          </ActionIcon>
        </Link>
        <Title>Redigere {defaultValue.name} </Title>
      </Flex>
      <Divider my="md" />

      <Form method="PUT" {...form.props}>
        <Table striped highlightOnHover withTableBorder>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Dag</Table.Th>
              <Table.Th w="50%">Tid</Table.Th>
              <Table.Th w="5%"></Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {slots.map((slot) => (
              <SlotInput key={slot.key} config={slot} form={form} />
            ))}
          </Table.Tbody>
        </Table>
        <SubmitButton>Opdatere</SubmitButton>
      </Form>
    </>
  );
}

const slotSchema = schema.shape.slots.element;
const intervalsSchema = slotSchema.shape.intervals;

function SlotInput({
  config,
  form,
}: {
  config: FieldConfig<z.infer<typeof slotSchema>>;
  form: any;
}) {
  const [checked, setChecked] = useState(
    config.defaultValue.intervals.length > 0,
  );
  const fields = useFieldset<z.infer<typeof slotSchema>>(form.ref, config);

  const intervals = useFieldList(form.ref, fields.intervals);

  return (
    <Table.Tr>
      <Table.Td>
        <Checkbox
          value={fields.day.defaultValue}
          name={fields.day.name}
          checked={checked}
          onChange={(event) => setChecked(event.currentTarget.checked)}
          label={fields.day.defaultValue}
        />
      </Table.Td>
      <Table.Td>
        {intervals.map((interval) => (
          <IntervalInput key={interval.key} config={interval} form={form} />
        ))}
      </Table.Td>
      <Table.Td>
        <ActionIcon size={34} variant="filled" aria-label="Tilføj tid">
          <IconPlus style={{width: rem(24), height: rem(24)}} />
        </ActionIcon>
      </Table.Td>
    </Table.Tr>
  );
}
function IntervalInput({
  config,
  form,
}: {
  config: FieldConfig<z.infer<typeof intervalsSchema.element>>;
  form: any;
}) {
  const {from, to} = useFieldset<z.infer<typeof intervalsSchema.element>>(
    form.ref,
    config,
  );

  return (
    <SimpleGrid cols={2}>
      <Select
        placeholder="Fra"
        data={generateTimeSlots(4, 20, 30)}
        {...conform.select(from)}
        defaultValue={undefined}
        value={config.defaultValue.from}
      />
      <Select
        placeholder="Til"
        {...conform.select(to)}
        defaultValue={undefined}
        value={config.defaultValue.to}
        data={generateTimeSlots(4, 20, 30)}
      />
    </SimpleGrid>
  );
}

const generateTimeSlots = (
  startHour: number,
  endHour: number,
  interval: number,
) => {
  const renderTime = (utcTime: string) => {
    const fixedDate = format(new Date(), 'yyyy-MM-dd');
    const utcDateTime = `${fixedDate}T${utcTime}:00.000Z`;
    return format(new Date(utcDateTime), 'HH:mm');
  };

  const timeSlots = [];
  let currentTime = set(new Date(), {
    hours: startHour,
    minutes: 0,
    seconds: 0,
    milliseconds: 0,
  });

  while (currentTime.getHours() < endHour) {
    const value = format(currentTime, 'HH:mm');
    timeSlots.push({
      value,
      label: renderTime(value),
    });
    currentTime = addMinutes(currentTime, interval);
  }

  return timeSlots;
};
