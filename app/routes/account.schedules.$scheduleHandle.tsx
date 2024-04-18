import {Form, useActionData, useLoaderData} from '@remix-run/react';
import {
  json,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
} from '@shopify/remix-oxygen';

import type {z} from 'zod';
import {getBookingShopifyApi} from '~/lib/api/bookingShopifyApi';

import {
  FormProvider,
  getFormProps,
  getInputProps,
  getSelectProps,
  useField,
  useForm,
  type FieldMetadata,
} from '@conform-to/react';
import {parseWithZod} from '@conform-to/zod';
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
import {useRef} from 'react';
import {redirectWithSuccess} from 'remix-toast';
import MobileModal from '~/components/MobileModal';
import {SubmitButton} from '~/components/form/SubmitButton';
import {CustomerScheduleSlotDay, type CustomerSchedule} from '~/lib/api/model';
import {baseURL} from '~/lib/api/mutator/query-client';
import {getCustomer} from '~/lib/get-customer';
import {renderTime} from '~/lib/time';
import {customerScheduleSlotUpdateBody} from '~/lib/zod/bookingShopifyApi';
import AccountSchedulesEdit from './account.schedules.$scheduleHandle.edit';
import {translationsDays} from './api.users.filters';

// this must be taken from bookingApi, if it doesn't exist, create it in booking-api
const schema = customerScheduleSlotUpdateBody;

export const action = async ({
  request,
  context,
  params,
}: ActionFunctionArgs) => {
  const customerId = await getCustomer({context});

  const {scheduleHandle} = params;
  if (!scheduleHandle) {
    throw new Error('missing scheduleHandler');
  }

  const formData = await request.formData();
  const submission = parseWithZod(formData, {
    schema,
  });

  if (submission.status !== 'success') {
    return submission.reply();
  }

  const slots = submission.value.slots.filter(
    ({intervals}) => intervals && intervals.length > 0,
  );

  try {
    const response = await getBookingShopifyApi().customerScheduleSlotUpdate(
      customerId,
      scheduleHandle,
      {slots},
    );

    await context.storefront.cache?.delete(
      `${baseURL}/customer/${customerId}/schedule/${scheduleHandle}`,
    );

    return redirectWithSuccess(`/account/schedules/${response.payload._id}`, {
      message: 'Vagtplan navn er opdateret!',
    });
  } catch (error) {
    return json(submission);
  }
};

export async function loader({context, params}: LoaderFunctionArgs) {
  const customerId = await getCustomer({context});

  const {scheduleHandle} = params;
  if (!scheduleHandle) {
    throw new Error('Missing productHandle param, check route filename');
  }

  const response = await getBookingShopifyApi().customerScheduleGet(
    customerId,
    scheduleHandle || '',
    context,
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
  const lastResult = useActionData<typeof action>();

  const [form, fields] = useForm({
    lastResult,
    defaultValue,
    onValidate({formData}) {
      return parseWithZod(formData, {
        schema,
      });
    },
    shouldValidate: 'onSubmit',
    shouldRevalidate: 'onInput',
  });

  const slotsList = fields.slots.getFieldList();

  return (
    <FormProvider context={form.context}>
      <Form method="PUT" {...getFormProps(form)}>
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
              <SlotInput key={slot.key} field={slot} />
            ))}
          </Table.Tbody>
        </Table>
      </Form>
    </FormProvider>
  );
}

const slotSchema = schema.shape.slots.element;
const intervalsSchema = slotSchema.shape.intervals;
const defaultValue = {from: '07:00', to: '14:00'};

type SlotInputProps = {
  field: FieldMetadata<z.infer<typeof slotSchema>>;
};

function SlotInput({field}: SlotInputProps) {
  const [, form] = useField(field.name);
  const {day, intervals} = field.getFieldset();
  const intervalsList = intervals.getFieldList();

  const onChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    const checked = event.currentTarget.checked;
    if (checked) {
      form.insert({name: intervals.name, defaultValue});
    } else {
      intervalsList.forEach((_, index) => {
        form.remove({name: intervals.name, index});
      });
    }
  };

  return (
    <Table.Tr>
      <Table.Td valign="middle">
        <input {...getInputProps(day, {type: 'hidden'})} />
        <Checkbox
          checked={intervalsList.length > 0}
          onChange={onChange}
          label={translationsDays[day.initialValue || '']}
          size="md"
          data-testid={`${day.initialValue}-checkbox`}
        />
      </Table.Td>
      <Table.Td>
        <Stack gap="sm">
          {intervalsList.length === 0 && <>Ingen tider</>}
          {intervalsList.map((interval: any, index: number) => (
            <Flex gap="sm" w="100%" key={interval.key}>
              <IntervalInput field={interval} day={day.initialValue || ''} />
              {index > 0 ? (
                <button
                  {...form.remove.getButtonProps({name: intervals.name, index})}
                  style={{display: 'flex', alignItems: 'center'}}
                  data-testid={`${day.initialValue}-remove-button`}
                >
                  <IconMinus style={{width: rem(24), height: rem(24)}} />
                </button>
              ) : (
                <button
                  {...form.insert.getButtonProps({
                    name: intervals.name,
                    defaultValue,
                  })}
                  data-testid={`${day.initialValue}-add-button`}
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

type IntervalInputProps = {
  field: FieldMetadata<z.infer<typeof intervalsSchema.element>>;
  day: string;
};

function IntervalInput({field, day}: IntervalInputProps) {
  const isMobile = useMediaQuery('(max-width: 62em)');
  const {from, to} = field.getFieldset();

  return (
    <Flex gap={{base: 'xs', sm: 'md'}}>
      <Select
        size={isMobile ? 'sm' : 'md'}
        placeholder="Fra"
        data={generateTimeSlots(4, 20, 30)}
        {...getSelectProps(from)}
        defaultValue={field.initialValue?.from}
        error={from.errors}
        withCheckIcon={false}
        data-testid={`${day}-from-select`}
      />
      <Select
        size={isMobile ? 'sm' : 'md'}
        placeholder="Til"
        {...getSelectProps(to)}
        defaultValue={field.initialValue?.to}
        data={generateTimeSlots(4, 20, 30)}
        error={to.errors}
        withCheckIcon={false}
        data-testid={`${day}-to-select`}
      />
    </Flex>
  );
}

const generateTimeSlots = (
  startHour: number,
  endHour: number,
  interval: number,
) => {
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
          <ActionIcon
            variant="light"
            aria-label="Settings"
            data-testid="settings-button"
          >
            <IconAdjustments
              style={{width: '70%', height: '70%'}}
              stroke={1.5}
            />
          </ActionIcon>
        </Menu.Target>

        <Menu.Dropdown>
          <Menu.Item
            leftSection={
              <IconEdit
                style={{width: rem(14), height: rem(14)}}
                data-testid="change-name-button"
              />
            }
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
            data-testid="delete-button"
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
