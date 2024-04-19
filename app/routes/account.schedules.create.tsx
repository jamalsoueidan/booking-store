import {getFormProps, getInputProps, useForm} from '@conform-to/react';
import {parseWithZod} from '@conform-to/zod';
import {FocusTrap, Stack, TextInput} from '@mantine/core';
import {Form, useActionData} from '@remix-run/react';
import {type ActionFunctionArgs} from '@shopify/remix-oxygen';
import {redirectWithSuccess} from 'remix-toast';
import {SubmitButton} from '~/components/form/SubmitButton';
import {getBookingShopifyApi} from '~/lib/api/bookingShopifyApi';
import {baseURL} from '~/lib/api/mutator/query-client';
import {getCustomer} from '~/lib/get-customer';
import {customerScheduleCreateBody} from '~/lib/zod/bookingShopifyApi';

const schema = customerScheduleCreateBody;

export const action = async ({request, context}: ActionFunctionArgs) => {
  const customerId = await getCustomer({context});
  const formData = await request.formData();
  const submission = parseWithZod(formData, {schema});

  if (submission.status !== 'success') {
    return submission.reply();
  }

  try {
    const response = await getBookingShopifyApi().customerScheduleCreate(
      customerId,
      submission.value,
    );

    await context.storefront.cache?.delete(
      `${baseURL}/customer/${customerId}/schedules`,
    );

    return redirectWithSuccess(`/account/schedules/${response.payload._id}`, {
      message: 'Du har oprettet en ny vagtplan',
    });
  } catch (error) {
    return submission.reply();
  }
};

export default function AccountSchedulesCreate() {
  const lastResult = useActionData<typeof action>();

  const [form, {name}] = useForm({
    lastResult,
    defaultValue: {
      name: '',
    },
    onValidate({formData}) {
      return parseWithZod(formData, {
        schema,
      });
    },
    onSubmit() {
      close();
    },
    shouldValidate: 'onSubmit',
    shouldRevalidate: 'onInput',
  });

  return (
    <FocusTrap active={true}>
      <Form method="POST" {...getFormProps(form)}>
        <Stack>
          <TextInput
            label="Navn"
            autoComplete="off"
            {...getInputProps(name, {type: 'text'})}
            data-testid="name-input"
          />
          <SubmitButton>Opret</SubmitButton>
        </Stack>
      </Form>
    </FocusTrap>
  );
}
