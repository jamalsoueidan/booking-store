import {getFormProps, getInputProps, useForm} from '@conform-to/react';
import {parseWithZod} from '@conform-to/zod';
import {FocusTrap, Modal, Stack, TextInput} from '@mantine/core';
import {Form, useActionData} from '@remix-run/react';
import type {ActionFunctionArgs} from 'react-router';
import {type z} from 'zod';
import DateTimeInput from '~/components/form/DateTimeInput';
import {SubmitButton} from '~/components/form/SubmitButton';
import {getBookingShopifyApi} from '~/lib/api/bookingShopifyApi';
import {getCustomer} from '~/lib/get-customer';
import {redirectWithNotification} from '~/lib/show-notification';
import {customerBlockedCreateBody} from '~/lib/zod/bookingShopifyApi';

const schema = customerBlockedCreateBody;

export const action = async ({request, context}: ActionFunctionArgs) => {
  const customerId = await getCustomer({context});

  const formData = await request.formData();
  const submission = parseWithZod(formData, {schema});

  if (submission.status !== 'success') {
    return submission.reply();
  }

  try {
    await getBookingShopifyApi().customerBlockedCreate(
      customerId,
      submission.value,
    );

    return redirectWithNotification(context, {
      redirectUrl: `/account/booked`,
      title: 'Ferie',
      message: 'Ferie er nu tilføjet!',
      color: 'green',
    });
  } catch (error) {
    return submission.reply();
  }
};

export default function AccountBookings() {
  const lastResult = useActionData<typeof action>();

  const [form, {title, start, end}] = useForm<z.infer<typeof schema>>({
    lastResult,
    onValidate({formData}) {
      return parseWithZod(formData, {
        schema,
      });
    },
    shouldValidate: 'onSubmit',
    shouldRevalidate: 'onInput',
  });

  return (
    <>
      <Modal.Header>
        <Modal.Title>Tilføj ferie</Modal.Title>
        <Modal.CloseButton />
      </Modal.Header>
      <Modal.Body>
        <FocusTrap active={true}>
          <Form method="POST" {...getFormProps(form)}>
            <Stack>
              <TextInput
                label="Title"
                autoComplete="off"
                placeholder="Vinterferie?"
                {...getInputProps(title, {type: 'text'})}
                data-autofocus
              />
              <DateTimeInput
                field={start}
                labels={{date: 'Fra dato', time: 'Fra tid'}}
              />
              <DateTimeInput
                field={end}
                labels={{date: 'Til dato', time: 'Til tid'}}
              />
              <SubmitButton>Tilføj ferie</SubmitButton>
            </Stack>
          </Form>
        </FocusTrap>
      </Modal.Body>
    </>
  );
}
