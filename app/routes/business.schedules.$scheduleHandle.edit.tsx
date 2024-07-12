import {getFormProps, getInputProps, useForm} from '@conform-to/react';
import {Form, useActionData, useLoaderData} from '@remix-run/react';

import {
  json,
  redirect,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
} from '@shopify/remix-oxygen';
import {getBookingShopifyApi} from '~/lib/api/bookingShopifyApi';
import {getCustomer} from '~/lib/get-customer';
import {customerScheduleCreateBody} from '~/lib/zod/bookingShopifyApi';

import {parseWithZod} from '@conform-to/zod';
import {FocusTrap, Stack, TextInput} from '@mantine/core';
import {SubmitButton} from '~/components/form/SubmitButton';
import {baseURL} from '~/lib/api/mutator/query-client';

const schema = customerScheduleCreateBody;

export const action = async ({
  request,
  context,
  params,
}: ActionFunctionArgs) => {
  const customerId = await getCustomer({context});
  const {scheduleHandle} = params;

  if (!customerId || !scheduleHandle) {
    throw new Error('Missing customer ID or schedule handle');
  }

  const formData = await request.formData();
  const submission = parseWithZod(formData, {schema});

  if (submission.status !== 'success') {
    return submission.reply();
  }

  try {
    const response = await getBookingShopifyApi().customerScheduleUpdate(
      customerId,
      scheduleHandle,
      submission.value,
    );

    await context.storefront.cache?.delete(
      `${baseURL}/customer/${customerId}/schedule/${scheduleHandle}`,
    );

    await context.storefront.cache?.delete(
      `${baseURL}/customer/${customerId}/schedules`,
    );

    return redirect(`/business/schedules/${response.payload._id}`);
  } catch (error) {
    return submission.reply();
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

  return json(response.payload);
}

export default function AccountSchedulesEdit() {
  const defaultValue = useLoaderData<typeof loader>();
  const lastResult = useActionData<typeof action>();

  const [form, {name}] = useForm({
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

  return (
    <FocusTrap active={true}>
      <Form method="post" {...getFormProps(form)}>
        <Stack>
          <TextInput
            label="Navn"
            autoComplete="off"
            {...getInputProps(name, {type: 'text'})}
            data-autofocus
            data-testid="name-input"
          />
          <SubmitButton data-testid="update-button">Gem ændringer</SubmitButton>
        </Stack>
      </Form>
    </FocusTrap>
  );
}
