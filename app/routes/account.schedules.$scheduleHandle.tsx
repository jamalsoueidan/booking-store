import {
  Form,
  Link,
  Outlet,
  useActionData,
  useLoaderData,
  useNavigate,
  useOutlet,
} from '@remix-run/react';
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
  useField,
  useForm,
  useInputControl,
  type FieldMetadata,
} from '@conform-to/react';
import {parseWithZod} from '@conform-to/zod';
import {
  ActionIcon,
  Checkbox,
  Flex,
  Group,
  Select,
  Stack,
  Table,
  Text,
  rem,
} from '@mantine/core';
import {useMediaQuery} from '@mantine/hooks';
import {IconEdit, IconMinus, IconPlus, IconX} from '@tabler/icons-react';
import {addMinutes, format, set} from 'date-fns';
import {useMemo} from 'react';
import {redirectWithSuccess} from 'remix-toast';
import {SubmitButton} from '~/components/form/SubmitButton';
import MobileModal from '~/components/MobileModal';
import {CustomerScheduleSlotDay} from '~/lib/api/model';
import {baseURL} from '~/lib/api/mutator/query-client';
import {getCustomer} from '~/lib/get-customer';
import {renderTime} from '~/lib/time';
import {customerScheduleSlotUpdateBody} from '~/lib/zod/bookingShopifyApi';
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
    await getBookingShopifyApi().customerScheduleSlotUpdate(
      customerId,
      scheduleHandle,
      {slots},
    );

    await context.storefront.cache?.delete(
      `${baseURL}/customer/${customerId}/schedule/${scheduleHandle}`,
    );

    return redirectWithSuccess('.', {
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
    throw new Error('Missing scheduleHandle param');
  }

  const response = await getBookingShopifyApi().customerScheduleGet(
    customerId,
    scheduleHandle,
    context,
  );

  const days = Object.values(CustomerScheduleSlotDay);

  // ensure all days exists in slots, so user can toggle on/off
  const slots = days
    .map((day) => {
      const existingSlot = response.payload?.slots?.find(
        (slot) => slot.day === day,
      );
      return existingSlot || {day, intervals: []};
    })
    .sort((a, b) => {
      return days.indexOf(a.day) - days.indexOf(b.day);
    });

  return json(
    {...response.payload, slots},
    {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    },
  );
}

export default function AccountSchedules() {
  const defaultValue = useLoaderData<typeof loader>();
  const lastResult = useActionData<typeof action>();
  const opened = !!useOutlet();
  const navigate = useNavigate();

  const close = () => {
    navigate('./');
  };

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
    <>
      <Group justify="space-between">
        <Text fz="xl" fw="bold" data-testid="schedule-title">
          {defaultValue.name} vagtplan:
        </Text>
        <Flex gap={{base: 'xs', sm: 'sm'}}>
          <ActionIcon component={Link} to="edit" size="md">
            <IconEdit
              style={{width: rem(24), height: rem(24)}}
              data-testid="change-name-button"
            />
          </ActionIcon>
          <Form method="post" action="destroy">
            <ActionIcon
              size="md"
              color="red"
              type="submit"
              data-testid="delete-button"
            >
              <IconX style={{width: rem(24), height: rem(24)}} />
            </ActionIcon>
          </Form>
        </Flex>
      </Group>
      <FormProvider context={form.context}>
        <Form method="post" {...getFormProps(form)}>
          <Table mt="lg" withTableBorder>
            <Table.Tbody>
              {slotsList.map((slot) => (
                <SlotInput key={slot.key} field={slot} />
              ))}
            </Table.Tbody>
          </Table>
          <Group mt="md">
            <SubmitButton size="sm">Gem ændringer</SubmitButton>
          </Group>
        </Form>
      </FormProvider>
      <MobileModal opened={opened} onClose={close} title="Opdater navn">
        <Outlet />
      </MobileModal>
    </>
  );
}

const slotSchema = schema.shape.slots.element;
const intervalsSchema = slotSchema.shape.intervals;
const defaultValue = {from: '08:00', to: '14:00'};

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

  const dayInput = useInputControl(day);

  return (
    <Table.Tr>
      <Table.Td valign="top">
        <Checkbox
          checked={intervalsList.length > 0}
          onChange={onChange}
          label={translationsDays[day.initialValue || '']}
          size={'sm'}
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
  const isMobile = useMediaQuery('(max-width: 48em)');
  const {from, to} = field.getFieldset();

  const fromInput = useInputControl(from);
  const toInput = useInputControl(to);

  const data = useMemo(() => generateTimeSlots(4, 20, 30), []);

  return (
    <Flex gap={{base: 'xs', sm: 'md'}}>
      <Select
        size={isMobile ? 'xs' : 'md'}
        placeholder="Fra"
        data={data}
        defaultValue={field.initialValue?.from}
        onChange={(value: string | null) => fromInput.change(value!)}
        error={from.errors}
        data-testid={`${day}-from-select`}
      />
      <Select
        size={isMobile ? 'xs' : 'md'}
        placeholder="Til"
        defaultValue={field.initialValue?.to}
        onChange={(value: string | null) => toInput.change(value!)}
        data={data}
        error={to.errors}
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
