import {Form, useActionData, useLoaderData} from '@remix-run/react';
import {
  json,
  redirect,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
} from '@shopify/remix-oxygen';

import {getCustomer} from '~/lib/get-customer';

import {
  FormProvider,
  getFormProps,
  useForm,
  useInputControl,
} from '@conform-to/react';
import {parseWithZod} from '@conform-to/zod';
import {Container, Progress, rem, Stack, Text, Title} from '@mantine/core';
import {useTranslation} from 'react-i18next';
import {z} from 'zod';
import {SubmitButton} from '~/components/form/SubmitButton';
import {CUSTOMER_DETAILS_QUERY} from '~/graphql/customer-account/CustomerDetailsQuery';
import {getBookingShopifyApi} from '~/lib/api/bookingShopifyApi';
import {CustomerScheduleSlotDay} from '~/lib/api/model';
import {updateCustomerTag} from '~/lib/updateTag';
import {customerScheduleSlotUpdateBody} from '~/lib/zod/bookingShopifyApi';
import {BottomSection, WrapSection} from './account.business';
import {SlotInput} from './business.schedules.$scheduleHandle';

const schema = customerScheduleSlotUpdateBody.extend({scheduleId: z.string()});

export const action = async ({
  request,
  context,
  params,
}: ActionFunctionArgs) => {
  const customerId = await getCustomer({context});

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
      submission.value.scheduleId,
      {slots},
    );

    await updateCustomerTag({
      env: context.env,
      customerId,
      tags: 'business-step1, business-step2, business-step3',
    });

    return redirect('/account/business/service');
  } catch (error) {
    return json(submission);
  }
};

export async function loader({context}: LoaderFunctionArgs) {
  const customerId = await getCustomer({context});

  const {data} = await context.customerAccount.query(CUSTOMER_DETAILS_QUERY);

  if (data.customer.tags.includes('business-step3')) {
    return redirect('/account/business/service');
  }

  let response = await getBookingShopifyApi().customerScheduleList(customerId);

  if (response.payload.length === 0) {
    await getBookingShopifyApi().customerScheduleCreate(customerId, {
      name: 'Eksempel',
    });

    response = await getBookingShopifyApi().customerScheduleList(customerId);
  }

  const schedule = response.payload[0];

  const days = Object.values(CustomerScheduleSlotDay);

  // ensure all days exists in slots, so user can toggle on/off
  const slots = days
    .map((day) => {
      const existingSlot = schedule.slots?.find((slot) => slot.day === day);
      return existingSlot || {day, intervals: []};
    })
    .sort((a, b) => {
      return days.indexOf(a.day) - days.indexOf(b.day);
    });

  return json({...schedule, slots, scheduleId: schedule._id});
}

export default function Component() {
  const {t} = useTranslation(['account', 'global', 'zod']);
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
  useInputControl(fields.scheduleId);

  return (
    <WrapSection>
      <Progress value={60} size="sm" />
      <FormProvider context={form.context}>
        <Form method="POST" {...getFormProps(form)}>
          <Container size="md" py={{base: 'sm', md: rem(60)}}>
            <Stack mb="xl">
              <div>
                <Text c="dimmed" tt="uppercase" fz="sm">
                  {t('account:business.step', {step: 3})}
                </Text>
                <Title fw="600" fz={{base: 'h2', sm: undefined}}>
                  {t('account:business.schedule.title')}
                </Title>
              </div>
            </Stack>

            <Stack gap="lg">
              {slotsList.map((slot) => (
                <SlotInput key={slot.key} field={slot} />
              ))}
            </Stack>
          </Container>

          <BottomSection>
            <SubmitButton size="md" disabled={!form.valid}>
              {t('account:business.schedule.submit')}
            </SubmitButton>
          </BottomSection>
        </Form>
      </FormProvider>
    </WrapSection>
  );
}
