import {conform, useForm} from '@conform-to/react';
import {ActionIcon, Divider, Flex, Select, Stack, Title} from '@mantine/core';
import {Form, Link, useActionData, useLoaderData} from '@remix-run/react';

import {
  json,
  redirect,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
} from '@shopify/remix-oxygen';

import {getBookingShopifyApi} from '~/lib/api/bookingShopifyApi';
import {getCustomer} from '~/lib/get-customer';
import {customerLocationAddParams} from '~/lib/zod/bookingShopifyApi';

import {parse} from '@conform-to/zod';
import {IconArrowLeft} from '@tabler/icons-react';
import {SubmitButton} from '~/components/form/SubmitButton';

export const action = async ({request, context}: ActionFunctionArgs) => {
  const customerAccessToken = await context.session.get('customerAccessToken');
  const customer = await getCustomer({context, customerAccessToken});

  console.log(customer.id);
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

    return redirect(`/account/locations`);
  } catch (error) {
    return json(submission);
  }
};

export async function loader({context}: LoaderFunctionArgs) {
  const customerAccessToken = await context.session.get('customerAccessToken');
  const customer = await getCustomer({context, customerAccessToken});

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
      <Flex direction={'row'} align={'center'}>
        <Link to="/account/locations">
          <ActionIcon
            variant="transparent"
            size="xl"
            aria-label="Back"
            color="black"
          >
            <IconArrowLeft style={{width: '70%', height: '70%'}} stroke={1.5} />
          </ActionIcon>
        </Link>
        <Title>Tilføj eksisterende lokation</Title>
      </Flex>
      <Divider my="md" />

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
