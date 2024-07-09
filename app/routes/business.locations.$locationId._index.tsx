import {
  FormProvider,
  getFormProps,
  getInputProps,
  useForm,
} from '@conform-to/react';
import {Form, Link, useActionData, useLoaderData} from '@remix-run/react';

import {
  json,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
} from '@shopify/remix-oxygen';
import {getBookingShopifyApi} from '~/lib/api/bookingShopifyApi';
import {getCustomer} from '~/lib/get-customer';
import {customerLocationUpdateBody} from '~/lib/zod/bookingShopifyApi';

import {parseWithZod} from '@conform-to/zod';
import {Anchor, Group, Stack, Text, TextInput} from '@mantine/core';
import {redirectWithSuccess} from 'remix-toast';
import {AddressAutocompleteInput} from '~/components/form/AddressAutocompleteInput';
import {NumericInput} from '~/components/form/NumericInput';
import {SubmitButton} from '~/components/form/SubmitButton';
import {baseURL} from '~/lib/api/mutator/query-client';

const schema = customerLocationUpdateBody;

export const action = async ({
  request,
  context,
  params,
}: ActionFunctionArgs) => {
  const customerId = await getCustomer({context});

  const {locationId} = params;
  if (!locationId) {
    throw new Response('Missing locationId param', {status: 404});
  }

  const formData = await request.formData();
  const submission = parseWithZod(formData, {schema});

  if (submission.status !== 'success') {
    return submission.reply();
  }

  try {
    await getBookingShopifyApi().customerLocationUpdate(
      customerId,
      locationId,
      submission.value,
    );

    await context.storefront.cache?.delete(
      `${baseURL}/customer/${customerId}/location/${locationId}`,
    );

    await context.storefront.cache?.delete(
      `${baseURL}/customer/${customerId}/locations`,
    );

    return redirectWithSuccess('.', {
      message: 'Lokation er opdateret!',
    });
  } catch (error) {
    return submission.reply();
  }
};

export async function loader({context, params}: LoaderFunctionArgs) {
  const customerId = await getCustomer({context});

  const {locationId} = params;
  if (!locationId) {
    throw new Response('Missing locationId param', {status: 404});
  }

  const response = await getBookingShopifyApi().customerLocationGet(
    customerId,
    locationId,
    context,
  );

  return json(response.payload);
}

export default function AccountLocationsEdit() {
  const defaultValue = useLoaderData<typeof loader>();
  const lastResult = useActionData<typeof action>();

  const [form, fields] = useForm({
    lastResult,
    defaultValue,
    onValidate({formData}) {
      return parseWithZod(formData, {
        schema,
      });
    },
    shouldValidate: 'onSubmit',
    shouldRevalidate: 'onInput',
  });

  return (
    <FormProvider context={form.context}>
      <Form method="post" {...getFormProps(form)}>
        <Stack>
          <TextInput
            label="Navn"
            placeholder="BySisters"
            {...getInputProps(fields.name, {type: 'text'})}
            data-testid="name-input"
          />

          <AddressAutocompleteInput
            label={
              defaultValue.locationType === 'destination'
                ? 'Hvor vil du kører fra?'
                : 'Hvor skal kunden køre til?'
            }
            placeholder="Sigridsvej 45, 8220 Brabrand"
            {...getInputProps(fields.fullAddress, {type: 'text'})}
            data-testid="address-input"
          />

          <NumericInput
            field={fields.startFee}
            label="Udgifter for turen"
            suffix=" kr"
            hidden={defaultValue.locationType !== 'destination'}
            data-testid="start-fee-input"
          />

          <NumericInput
            field={fields.distanceHourlyRate}
            label="Timepris for kørsel"
            suffix=" kr"
            hidden={defaultValue.locationType !== 'destination'}
            data-testid="hourly-rate-input"
          />

          <NumericInput
            field={fields.fixedRatePerKm}
            label="Pris pr. kilometer"
            suffix=" kr"
            hidden={defaultValue.locationType !== 'destination'}
            data-testid="fixed-rate-input"
          />

          <NumericInput
            field={fields.distanceForFree}
            label="Afstanden der køres gratis, inden takstberegningen påbegyndes."
            suffix=" km"
            hidden={defaultValue.locationType !== 'destination'}
            data-testid="distance-free-input"
          />

          <NumericInput
            field={fields.minDriveDistance}
            label="Minimum der skal køres for at acceptere en kørselsopgave"
            suffix=" km"
            hidden={defaultValue.locationType !== 'destination'}
            data-testid="min-drive-distance-input"
          />

          <NumericInput
            field={fields.maxDriveDistance}
            label="Maximum der køres"
            suffix=" km"
            hidden={defaultValue.locationType !== 'destination'}
            data-testid="max-drive-distance-input"
          />

          <Group>
            <SubmitButton>Gem ændringer</SubmitButton>
            <Text>eller</Text>
            <Anchor
              component={Link}
              to="/business/locations"
              data-testid="back-link"
            >
              Tilbage
            </Anchor>
          </Group>
        </Stack>
      </Form>
    </FormProvider>
  );
}
