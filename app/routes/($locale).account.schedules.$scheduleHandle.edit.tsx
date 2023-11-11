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

import {FocusTrap, Stack, TextInput} from '@mantine/core';
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
    context.session.set('notify', {
      title: 'Vagtplan',
      message: 'Vagtplan navn er opdateret!',
      color: 'green',
    });

    const response = await getBookingShopifyApi().customerScheduleUpdate(
      customer.id,
      scheduleHandle || '',
      submission.value,
    );

    return redirect(`/account/schedules/${response.payload._id}`, {
      headers: {
        'Set-Cookie': await context.session.commit(),
      },
    });
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

export default function AccountSchedulesEdit({close}: {close: () => void}) {
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
    onSubmit(event, context) {
      close();
    },
    shouldValidate: 'onSubmit',
    shouldRevalidate: 'onInput',
  });

  return (
    <FocusTrap active={true}>
      <Form method="PUT" action="edit" {...form.props}>
        <Stack>
          <TextInput
            label="Navn"
            autoComplete="off"
            {...conform.input(name)}
            data-autofocus
          />
          <SubmitButton>Opdatere</SubmitButton>
        </Stack>
      </Form>
    </FocusTrap>
  );
}
