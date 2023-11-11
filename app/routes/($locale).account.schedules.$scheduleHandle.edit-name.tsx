import {conform, useForm} from '@conform-to/react';
import {parse} from '@conform-to/zod';
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

import {Stack, TextInput} from '@mantine/core';
import {SubmitButton} from '~/components/form/SubmitButton';

const schema = customerScheduleCreateBody;

export const action = async ({
  request,
  context,
  params,
}: ActionFunctionArgs) => {
  const customer = await getCustomer({context});
  const {scheduleHandle} = params;

  const formData = await request.formData();
  const submission = parse(formData, {schema});

  if (submission.intent !== 'submit' || !submission.value) {
    return json(submission);
  }

  try {
    const response = await getBookingShopifyApi().customerScheduleUpdate(
      customer.id,
      scheduleHandle || '',
      submission.value,
    );

    return redirect(`/account/schedules/${response.payload._id}`);
  } catch (error) {
    return json(submission);
  }
};

export async function loader({context, params}: LoaderFunctionArgs) {
  const customer = await getCustomer({context});

  const response = await getBookingShopifyApi().customerLocationGet(
    customer.id,
    params.locationId || '',
  );

  return json(response.payload);
}

export default function AccountLocationsEdit() {
  const defaultValue = useLoaderData<typeof loader>();
  const lastSubmission = useActionData<typeof action>();

  const [form, {name}] = useForm({
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

  return (
    <Form method="PUT" {...form.props}>
      <Stack>
        <TextInput
          label="Navn"
          autoComplete="off"
          placeholder="BySisters"
          {...conform.input(name)}
        />
        <SubmitButton>Opdatere</SubmitButton>
      </Stack>
    </Form>
  );
}
