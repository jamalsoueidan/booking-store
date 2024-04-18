import {getFormProps, getInputProps, useForm} from '@conform-to/react';
import {Form, useActionData, useLoaderData} from '@remix-run/react';

import {
  json,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
} from '@shopify/remix-oxygen';
import {getBookingShopifyApi} from '~/lib/api/bookingShopifyApi';
import {getCustomer} from '~/lib/get-customer';
import {customerScheduleCreateBody} from '~/lib/zod/bookingShopifyApi';

import {parseWithZod} from '@conform-to/zod';
import {FocusTrap, Stack, TextInput} from '@mantine/core';
import {redirectWithSuccess} from 'remix-toast';
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

    return redirectWithSuccess(`/account/schedules/${response.payload._id}`, {
      message: 'Vagtplan er opdateret!',
    });
  } catch (error) {
    return submission.reply();
  }
};

export async function loader({context, params}: LoaderFunctionArgs) {
  const customerId = await getCustomer({context});

  const response = await getBookingShopifyApi().customerLocationGet(
    customerId,
    params.locationId || '',
    context,
  );

  return json(response.payload);
}

export default function AccountSchedulesEdit({close}: {close: () => void}) {
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
    onSubmit(event, context) {
      close();
    },
    shouldValidate: 'onSubmit',
    shouldRevalidate: 'onInput',
  });

  return (
    <FocusTrap active={true}>
      <Form method="PUT" action="edit" {...getFormProps(form)}>
        <Stack>
          <TextInput
            label="Navn"
            autoComplete="off"
            {...getInputProps(name, {type: 'text'})}
            data-autofocus
            data-testid="name-input"
          />
          <SubmitButton>Opdatere</SubmitButton>
        </Stack>
      </Form>
    </FocusTrap>
  );
}
