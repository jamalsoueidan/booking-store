import {conform, useForm} from '@conform-to/react';
import {parse} from '@conform-to/zod';
import {FocusTrap, Stack, TextInput} from '@mantine/core';
import {Form, useActionData} from '@remix-run/react';
import {json, redirect, type ActionFunctionArgs} from '@shopify/remix-oxygen';
import {SubmitButton} from '~/components/form/SubmitButton';
import {getBookingShopifyApi} from '~/lib/api/bookingShopifyApi';
import {getCustomer} from '~/lib/get-customer';
import {customerScheduleCreateBody} from '~/lib/zod/bookingShopifyApi';

const schema = customerScheduleCreateBody;

export const action = async ({
  request,
  context,
  params,
}: ActionFunctionArgs) => {
  const customer = await getCustomer({context});
  const formData = await request.formData();
  const submission = parse(formData, {schema});

  if (submission.intent !== 'submit' || !submission.value) {
    return json(submission);
  }

  try {
    const response = await getBookingShopifyApi().customerScheduleCreate(
      customer.id,
      submission.value,
    );

    return redirect(`/account/schedules/${response.payload._id}`);
  } catch (error) {
    return json(submission);
  }
};

export default function AccountSchedulesCreate({close}: {close: () => void}) {
  const lastSubmission = useActionData<typeof action>();

  const [form, {name}] = useForm({
    lastSubmission,
    defaultValue: {
      name: '',
    },
    onValidate({formData}) {
      return parse(formData, {
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
      <Form method="PUT" action="create" {...form.props}>
        <Stack>
          <TextInput
            label="Navn"
            autoComplete="off"
            {...conform.input(name)}
            data-autofocus
          />
          <SubmitButton>Opret</SubmitButton>
        </Stack>
      </Form>
    </FocusTrap>
  );
}
