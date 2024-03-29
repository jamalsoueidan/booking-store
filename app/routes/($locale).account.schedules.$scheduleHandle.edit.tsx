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
import {setNotification} from '~/lib/show-notification';

const schema = customerScheduleCreateBody;

export const action = async ({
  request,
  context,
  params,
}: ActionFunctionArgs) => {
  const customer = await getCustomer({context});
  const {scheduleHandle} = params;

  const formData = await request.formData();
  const submission = parseWithZod(formData, {schema});

  if (submission.status !== 'success') {
    return submission.reply();
  }

  try {
    setNotification(context, {
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
    return submission.reply();
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
          />
          <SubmitButton>Opdatere</SubmitButton>
        </Stack>
      </Form>
    </FocusTrap>
  );
}
