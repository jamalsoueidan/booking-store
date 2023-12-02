import {useForm} from '@conform-to/react';
import {parse} from '@conform-to/zod';
import {
  Divider,
  Flex,
  Stack,
  Text,
  TextInput,
  Textarea,
  Title,
} from '@mantine/core';
import {Form, useActionData, useLoaderData} from '@remix-run/react';
import {parseGid} from '@shopify/hydrogen';
import {
  json,
  redirect,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
} from '@shopify/remix-oxygen';
import {z} from 'zod';
import {SubmitButton} from '~/components/form/SubmitButton';

import {getBookingShopifyApi} from '~/lib/api/bookingShopifyApi';
import {getCustomer} from '~/lib/get-customer';
import {redirectWithNotification} from '~/lib/show-notification';
import {customerUpsertBody} from '~/lib/zod/bookingShopifyApi';
import {CUSTOMER_QUERY} from './($locale).account';

export const schema = customerUpsertBody;

export async function action({request, params, context}: ActionFunctionArgs) {
  const customer = await getCustomer({context});

  const formData = await request.formData();
  const submission = parse(formData, {schema});

  if (submission.intent !== 'submit' || !submission.value) {
    return json(submission);
  }

  try {
    await getBookingShopifyApi().customerUpsert(
      parseGid(customer.id).id,
      submission.value,
    );

    return redirectWithNotification(context, {
      redirectUrl: `/account/dashboard`,
      title: 'Business konto',
      message: 'Du er nu business konto',
      color: 'green',
    });
  } catch (error) {
    return json(submission);
  }
}

export async function loader({context, params}: LoaderFunctionArgs) {
  const customerAccessToken = await context.session.get('customerAccessToken');

  if (!customerAccessToken) {
    return redirect('/account/login');
  }

  const {customer} = await context.storefront.query(CUSTOMER_QUERY, {
    variables: {
      customerAccessToken: customerAccessToken.accessToken,
      country: context.storefront.i18n.country,
      language: context.storefront.i18n.language,
    },
    cache: context.storefront.CacheNone(),
  });

  if (!customer) {
    return redirect('/account/login');
  }

  if (!customer.firstName || !customer.lastName) {
    return redirect(
      `${params?.locale || ''}/account/profile?${
        !customer.firstName ? 'firstName=true&' : ''
      }${!customer.lastName ? 'lastName=true' : ''}`,
    );
  }

  const professionOptions = await getBookingShopifyApi().metaProfessions();

  return json({
    customer,
    professionOptions,
    defaultValue: {} as z.infer<typeof schema>,
  });
}

export default function AccountBusiness() {
  const lastSubmission = useActionData<typeof action>();
  const {customer, professionOptions, defaultValue} =
    useLoaderData<typeof loader>();

  const [form, fields] = useForm({
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

  // Step 1: Remove bad characters
  const username = convertToValidUrlPath(
    customer?.firstName || '',
    customer?.lastName || '',
  );

  return (
    <>
      <Flex direction={'row'} align={'center'}>
        <Title>Register selvstændig</Title>
      </Flex>
      <Divider my="md" />
      <Text mb="md">
        Du er igang med at register dig på bySisters som selvstændig
        skønhedsekspert, det betyder at du nu kan modtag bookings fra kunder der
        er interesseret i din ydelser som du tilbyder via bysisters.dk
      </Text>

      <Form method="post" {...form.props}>
        <Stack gap="md">
          <TextInput
            label="Vælge en profilnavn"
            name="username"
            placeholder="fida-soueidan"
          />

          <TextInput
            label="Skriv kort om dig selv."
            name="shortDescription"
            placeholder="Har arbejdet hos mac i 5 år"
          />

          <Textarea
            label="Fortæl om dig selv"
            name="aboutMe"
            minRows={6}
            autosize
          />

          <SubmitButton>Opret en business konto</SubmitButton>
        </Stack>
      </Form>
    </>
  );
}

function convertToValidUrlPath(firstName: string, lastName: string): string {
  const allowedCharactersRegex = /[^a-zA-Z0-9\-_]/g;
  firstName = firstName.replace(allowedCharactersRegex, '');
  lastName = lastName.replace(allowedCharactersRegex, '');
  const urlPath = `${firstName}-${lastName}`;
  return urlPath?.toLowerCase();
}
