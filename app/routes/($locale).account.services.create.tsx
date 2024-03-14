import {
  FormProvider,
  getFormProps,
  getInputProps,
  getSelectProps,
  useForm,
} from '@conform-to/react';
import {parseWithZod} from '@conform-to/zod';
import {Flex, Select, Stack, TextInput} from '@mantine/core';
import {Form, useActionData, useLoaderData} from '@remix-run/react';
import {
  json,
  redirect,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
} from '@shopify/remix-oxygen';
import {z} from 'zod';
import PeriodInput from '~/components/form/PeriodInput';
import {SelectSearchable} from '~/components/form/SelectSearchable';

import {SubmitButton} from '~/components/form/SubmitButton';
import {SwitchGroupLocations} from '~/components/form/SwitchGroupLocations';

import {getBookingShopifyApi} from '~/lib/api/bookingShopifyApi';

import {AccountContent} from '~/components/account/AccountContent';
import {AccountTitle} from '~/components/account/AccountTitle';
import {NumericInput} from '~/components/form/NumericInput';
import {getCustomer} from '~/lib/get-customer';
import {customerProductUpsertBody} from '~/lib/zod/bookingShopifyApi';
import {type ActionReturnType} from './($locale).api.account.services.$productId.create-variant';

const schema = customerProductUpsertBody
  .omit({
    variantId: true,
    selectedOptions: true,
    price: true,
    compareAtPrice: true,
    productHandle: true,
  })
  .extend({
    productId: z.string().min(1),
    scheduleId: z.string().min(1),
    price: z.number(),
    compareAtPrice: z.number(),
  });

type DefaultValues = z.infer<typeof schema>;

export const action = async ({request, context}: ActionFunctionArgs) => {
  const customer = await getCustomer({context});
  const formData = await request.formData();
  const submission = parseWithZod(formData, {
    schema,
  });

  if (submission.status !== 'success') {
    return submission.reply();
  }

  try {
    const {productId, ...values} = submission.value;

    const actionResponse = await fetch(
      new URL(`/api/account/services/${productId}/create-variant`, request.url),
      {
        method: 'POST',
        body: JSON.stringify(values),
      },
    );

    const response: ActionReturnType =
      (await actionResponse.json()) as ActionReturnType;

    await getBookingShopifyApi().customerProductUpsert(customer.id, productId, {
      ...values,
      ...response,
      compareAtPrice: response.compareAtPrice,
    });

    return redirect(`/account/services/${productId}`);
  } catch (error) {
    return submission.reply();
  }
};

export async function loader({context}: LoaderFunctionArgs) {
  const customer = await getCustomer({context});

  const schedule = await getBookingShopifyApi().customerScheduleList(
    customer.id,
  );

  const locations = await getBookingShopifyApi().customerLocationList(
    customer.id,
  );

  const findDefaultLocation = locations.payload.find((l) => l.isDefault) || {
    _id: '',
    locationType: 'origin',
  };

  return json({
    locations: locations.payload,
    schedules: schedule.payload,
    defaultValue: {
      scheduleId: schedule.payload[0]._id,
      duration: 60,
      breakTime: 15,
      compareAtPrice: 0,
      price: 0,
      bookingPeriod: {
        unit: 'months',
        value: 4,
      },
      noticePeriod: {
        unit: 'days',
        value: 1,
      },
      locations: [
        {
          location: findDefaultLocation?._id,
          locationType: findDefaultLocation?.locationType,
        },
      ],
    } as DefaultValues,
  });
}

export default function AccountServicesCreate() {
  const {locations, defaultValue, schedules} = useLoaderData<typeof loader>();
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

  const selectSchedules = schedules.map((schedule) => ({
    value: schedule._id,
    label: schedule.name,
  }));

  return (
    <>
      <AccountTitle linkBack="/account/services" heading="Opret en ydelse" />
      <AccountContent>
        <FormProvider context={form.context}>
          <Form method="post" {...getFormProps(form)}>
            <Stack>
              <SelectSearchable
                label="Hvilken ydelse vil du tilbyde?"
                placeholder="Vælg ydelse"
                field={fields.productId}
              />

              <Flex gap="1">
                <NumericInput
                  field={fields.price}
                  label="Pris"
                  required
                  style={{flex: 1}}
                />
                <NumericInput
                  field={fields.compareAtPrice}
                  label="Før-pris"
                  style={{flex: 1}}
                />
              </Flex>

              <SwitchGroupLocations
                label="Fra hvilken lokation(er) vil du tilbyde den ydelse?"
                description="Mindst (1) skal være valgt."
                field={fields.locations}
                data={locations}
              />

              <Select
                label="Hvilken vagtplan vil du tilknytte den ydelse på."
                data={selectSchedules}
                {...getSelectProps(fields.scheduleId)}
                allowDeselect={false}
                defaultValue={fields.scheduleId.initialValue}
              />

              <Flex align={'flex-end'} gap="xs">
                <TextInput
                  w="50%"
                  label="Behandlingstid:"
                  rightSection="min"
                  {...getInputProps(fields.duration, {type: 'number'})}
                />
                <TextInput
                  w="50%"
                  label="Pause efter behandling:"
                  rightSection="min"
                  {...getInputProps(fields.breakTime, {type: 'number'})}
                />
              </Flex>

              <PeriodInput
                field={fields.bookingPeriod}
                label="Hvor langt ude i fremtiden vil du acceptere bookinger?"
                data={[
                  {value: 'months', label: 'Måneder'},
                  {value: 'hours', label: 'Timer'},
                ]}
              />

              <PeriodInput
                field={fields.noticePeriod}
                label="Minimum tid før ankomst en kunde kan booke online?"
                data={[
                  {value: 'days', label: 'Dage'},
                  {value: 'hours', label: 'Timer'},
                ]}
              />

              <SubmitButton>Tilføj ny ydelse</SubmitButton>
            </Stack>
          </Form>
        </FormProvider>
      </AccountContent>
    </>
  );
}
