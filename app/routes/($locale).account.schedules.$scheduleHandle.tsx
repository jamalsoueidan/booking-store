import {Form, useActionData, useLoaderData} from '@remix-run/react';
import {
  json,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
} from '@shopify/remix-oxygen';

import type {z} from 'zod';
import {getBookingShopifyApi} from '~/lib/api/bookingShopifyApi';

import {
  conform,
  list,
  requestIntent,
  useFieldList,
  useFieldset,
  useForm,
  type FieldConfig,
} from '@conform-to/react';
import {parse} from '@conform-to/zod';
import {
  ActionIcon,
  Checkbox,
  Flex,
  Menu,
  Select,
  Stack,
  Table,
  rem,
} from '@mantine/core';
import {useDisclosure, useMediaQuery} from '@mantine/hooks';
import {
  IconAdjustments,
  IconEdit,
  IconMinus,
  IconPlus,
} from '@tabler/icons-react';
import {addMinutes, format, set} from 'date-fns';
import {useRef, useState} from 'react';
import MobileModal from '~/components/MobileModal';
import {SubmitButton} from '~/components/form/SubmitButton';
import {CustomerScheduleSlotDay, type CustomerSchedule} from '~/lib/api/model';
import {getCustomer} from '~/lib/get-customer';
import {redirectWithNotification} from '~/lib/show-notification';
import {customerScheduleSlotUpdateBody} from '~/lib/zod/bookingShopifyApi';
import AccountSchedulesEdit from './($locale).account.schedules.$scheduleHandle.edit';

// this must be taken from bookingApi, if it doesn't exist, create it in booking-api
const schema = customerScheduleSlotUpdateBody;

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

  const slots = submission.value.slots.filter(
    ({intervals}) => intervals && intervals.length > 0,
  );

  try {
    const response = await getBookingShopifyApi().customerScheduleSlotUpdate(
      customer.id,
      scheduleHandle,
      {slots},
    );

    return redirectWithNotification(context, {
      redirectUrl: `/account/schedules/${response.payload._id}`,
      title: 'Vagtplan',
      message: 'Vagtplan navn er opdateret!',
      color: 'green',
    });
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

  return json({...response.payload, slots});
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
    fallbackNative: true,
    shouldValidate: 'onSubmit',
    shouldRevalidate: 'onInput',
  });

  const slotsList = useFieldList(form.ref, fields.slots);

  return (
    <>
      <Form method="PUT" {...form.props}>
        <Table mt="lg" withTableBorder>
          <Table.Thead>
            <Table.Tr>
              <Table.Th w="30%">{defaultValue.name}</Table.Th>
              <Table.Th>
                <Flex justify="right" gap="sm">
                  <SubmitButton size="xs">Gem</SubmitButton>
                  <MenuToggle schedule={defaultValue} />
                </Flex>
              </Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {slotsList.map((slot) => (
              <SlotInput key={slot.key} config={slot} form={form} />
            ))}
          </Table.Tbody>
        </Table>
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
  const {day, intervals} = useFieldset<z.infer<typeof slotSchema>>(
    form.ref,
    config,
  );

  const intervalsList = useFieldList(form.ref, intervals);

  const onChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    const checked = event.currentTarget.checked;
    setChecked(checked);

    if (checked) {
      requestIntent(
        form.ref.current,
        list.insert(intervals.name, {
          defaultValue: {from: '', to: ''},
        }),
      );
    } else {
      intervalsList.forEach((_, index) => {
        requestIntent(
          form.ref.current,
          list.remove(intervals.name, {
            index,
          }),
        );
      });
    }
  };

  const trans: any = {
    monday: 'mandag',
    tuesday: 'tirsdag',
    wednesday: 'onsdag',
    thursday: 'torsdag',
    friday: 'fredag',
    saturday: 'lørdag',
    sunday: 'søndag',
  };

  return (
    <Table.Tr>
      <Table.Td valign="middle">
        <input {...conform.input(day, {hidden: true})} />
        <Checkbox
          checked={checked}
          onChange={onChange}
          label={trans[day.defaultValue || '']}
          size="md"
        />
      </Table.Td>
      <Table.Td>
        <Stack gap="sm">
          {intervalsList.length === 0 && <>Ingen tider</>}
          {intervalsList.map((interval: any, index: number) => (
            <Flex gap="sm" w="100%" key={interval.key}>
              <IntervalInput config={interval} form={form} />
              {index > 0 ? (
                <button
                  {...list.remove(intervals.name, {index})}
                  style={{display: 'flex', alignItems: 'center'}}
                >
                  <IconMinus style={{width: rem(24), height: rem(24)}} />
                </button>
              ) : (
                <button
                  {...list.insert(intervals.name, {
                    defaultValue: {from: '05:00', to: '13:00'}, //default time
                  })}
                  style={{display: 'flex', alignItems: 'center'}}
                >
                  <IconPlus style={{width: rem(24), height: rem(24)}} />
                </button>
              )}
            </Flex>
          ))}
        </Stack>
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
  const isMobile = useMediaQuery('(max-width: 62em)');
  const {from, to} = useFieldset<z.infer<typeof intervalsSchema.element>>(
    form.ref,
    config,
  );

  return (
    <Flex gap={isMobile ? 'xs' : 'md'}>
      <Select
        size={isMobile ? 'sm' : 'md'}
        placeholder="Fra"
        data={generateTimeSlots(4, 20, 30)}
        {...conform.select(from)}
        defaultValue={config.defaultValue.from}
        error={from.error}
        withCheckIcon={false}
      />
      <Select
        size={isMobile ? 'sm' : 'md'}
        placeholder="Til"
        {...conform.select(to)}
        defaultValue={config.defaultValue.to}
        data={generateTimeSlots(4, 20, 30)}
        error={to.error}
        withCheckIcon={false}
      />
    </Flex>
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

function MenuToggle({
  schedule,
}: {
  schedule: Pick<CustomerSchedule, '_id' | 'name'>;
}) {
  const [opened, {open, close}] = useDisclosure(false);
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <>
      <Menu width={200} shadow="md" trigger="click">
        <Menu.Target>
          <ActionIcon variant="light" aria-label="Settings">
            <IconAdjustments
              style={{width: '70%', height: '70%'}}
              stroke={1.5}
            />
          </ActionIcon>
        </Menu.Target>

        <Menu.Dropdown>
          <Menu.Item
            leftSection={<IconEdit style={{width: rem(14), height: rem(14)}} />}
            onClick={open}
          >
            Ændre navn
          </Menu.Item>
          <Menu.Item
            color="red"
            ref={formRef}
            leftSection={
              <IconMinus style={{width: rem(14), height: rem(14)}} />
            }
            component="form"
            method="post"
            action={`${schedule._id}/destroy`}
            onClick={(event: React.MouseEvent<HTMLFormElement>) => {
              event.preventDefault();
              if (formRef.current) {
                formRef.current.submit();
              }
            }}
          >
            Slet
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
      <MobileModal opened={opened} onClose={close} title="Opdater navn">
        <AccountSchedulesEdit close={close} />
      </MobileModal>
    </>
  );
}
