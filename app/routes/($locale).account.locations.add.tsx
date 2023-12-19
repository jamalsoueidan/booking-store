import {conform, useForm} from '@conform-to/react';
import {Select, Stack} from '@mantine/core';
import {Form, useActionData, useLoaderData} from '@remix-run/react';

import {
  json,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
} from '@shopify/remix-oxygen';

import {getBookingShopifyApi} from '~/lib/api/bookingShopifyApi';
import {getCustomer} from '~/lib/get-customer';
import {customerLocationAddParams} from '~/lib/zod/bookingShopifyApi';

import {parse} from '@conform-to/zod';
import {AccountTitle} from '~/components/account/AccountTitle';
import {SubmitButton} from '~/components/form/SubmitButton';
import {redirectWithNotification} from '~/lib/show-notification';

export const action = async ({request, context}: ActionFunctionArgs) => {
  const customer = await getCustomer({context});

  const formData = await request.formData();
  const submission = parse(formData, {
    schema: customerLocationAddParams.pick({locationId: true}),
  });

  if (submission.intent !== 'submit' || !submission.value) {
    return json(submission);
  }

  try {
    await getBookingShopifyApi().customerLocationAdd(
      customer.id,
      submission.value.locationId,
    );

    return redirectWithNotification(context, {
      redirectUrl: `/account/locations`,
      title: 'Lokation',
      message: 'Lokation er nu oprettet!',
      color: 'green',
    });
  } catch (error) {
    return json(submission);
  }
};

export async function loader({context}: LoaderFunctionArgs) {
  const customer = await getCustomer({context});

  const response = await getBookingShopifyApi().customerLocationGetAllOrigins(
    customer.id,
  );

  return json(response.payload);
}

export default function Component() {
  const locationOrigins = useLoaderData<typeof loader>();
  const lastSubmission = useActionData<typeof action>();

  const [form, {locationId}] = useForm({
    lastSubmission,
    defaultValue: {
      locationId: '',
    },
  });

  const data = locationOrigins.map((origin) => ({
    label: origin.name + ': ' + origin.fullAddress,
    value: origin._id,
  }));

  return (
    <>
      <AccountTitle
        heading="Tilføj eksisterende lokation"
        linkBack="/account/locations"
      />

      <Form method="POST" {...form.props}>
        <Stack>
          <Select
            label="Vælg lokation"
            description="hvis lokationen allerede er oprettet, kan du tilføje dig selv til den,
        så kan du nemlig tilbyde service fra det sted."
            data={data}
            {...conform.select(locationId)}
            defaultValue=""
          />
          <SubmitButton>Tilføj</SubmitButton>
        </Stack>
      </Form>
    </>
  );
}
