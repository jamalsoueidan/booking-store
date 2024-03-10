import {getFormProps, getInputProps, useForm} from '@conform-to/react';
import {parseWithZod} from '@conform-to/zod';
import {FocusTrap, Stack, TextInput} from '@mantine/core';
import {Form, useActionData} from '@remix-run/react';
import {type ActionFunctionArgs} from '@shopify/remix-oxygen';
import {SubmitButton} from '~/components/form/SubmitButton';
import {getBookingShopifyApi} from '~/lib/api/bookingShopifyApi';
import {getCustomer} from '~/lib/get-customer';
import {redirectWithNotification} from '~/lib/show-notification';
import {customerScheduleCreateBody} from '~/lib/zod/bookingShopifyApi';

const schema = customerScheduleCreateBody;

export const action = async ({request, context}: ActionFunctionArgs) => {
  const customer = await getCustomer({context});
  const formData = await request.formData();
  const submission = parseWithZod(formData, {schema});

  if (submission.status !== 'success') {
    return submission.reply();
  }

  try {
    const response = await getBookingShopifyApi().customerScheduleCreate(
      customer.id,
      submission.value,
    );

    return redirectWithNotification(context, {
      redirectUrl: `/account/schedules/${response.payload._id}`,
      title: 'Vagtplan',
      message: 'Du har oprettet en ny vagtplan',
      color: 'green',
    });
  } catch (error) {
    return submission.reply();
  }
};

export default function AccountSchedulesCreate({close}: {close: () => void}) {
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
      <Form method="PUT" action="create" {...getFormProps(form)}>
        <Stack>
          <TextInput
            label="Navn"
            autoComplete="off"
            {...getInputProps(name, {type: 'text'})}
            data-autofocus
          />
          <SubmitButton>Opret</SubmitButton>
        </Stack>
      </Form>
    </FocusTrap>
  );
}
