import {Form, useActionData, useLoaderData} from '@remix-run/react';
import {
  json,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
} from '@shopify/remix-oxygen';

import {getCustomer} from '~/lib/get-customer';
import {customerLocationCreateBody} from '~/lib/zod/bookingShopifyApi';

import {getFormProps, getInputProps, useForm} from '@conform-to/react';
import {parseWithZod} from '@conform-to/zod';
import {Select, Stack, TextInput} from '@mantine/core';
import {redirectWithSuccess} from 'remix-toast';
import {AccountContent} from '~/components/account/AccountContent';
import {AccountTitle} from '~/components/account/AccountTitle';
import {AddressAutocompleteInput} from '~/components/form/AddressAutocompleteInput';
import {NumericInput} from '~/components/form/NumericInput';
import {RadioGroup} from '~/components/form/RadioGroup';
import {SubmitButton} from '~/components/form/SubmitButton';
import {getBookingShopifyApi} from '~/lib/api/bookingShopifyApi';
import {baseURL} from '~/lib/api/mutator/query-client';

const schema = customerLocationCreateBody;

export async function loader({context}: LoaderFunctionArgs) {
  await context.customerAccount.handleAuthStatus();

  return json({
    name: '',
    locationType: 'origin',
    fullAddress: '',
    originType: 'commercial',
    distanceHourlyRate: 500,
    fixedRatePerKm: 20,
    distanceForFree: 4,
    minDriveDistance: 0,
    maxDriveDistance: 300,
    startFee: 0,
  });
}

export const action = async ({request, context}: ActionFunctionArgs) => {
  const customerId = await getCustomer({context});

  const formData = await request.formData();
  const submission = parseWithZod(formData, {schema});

  if (submission.status !== 'success') {
    return submission.reply();
  }

  try {
    await getBookingShopifyApi().customerLocationCreate(
      customerId,
      submission.value,
    );

    await context.storefront.cache?.delete(
      `${baseURL}/customer/${customerId}/locations`,
    );

    return redirectWithSuccess('/account/locations', {
      message: 'Lokation er nu oprettet!',
    });
  } catch (error) {
    return submission.reply();
  }
};

export default function Component() {
  const lastResult = useActionData<typeof action>();
  const defaultValue = useLoaderData<typeof loader>();

  const [form, fields] = useForm({
    lastResult,
    defaultValue,
    onValidate({formData}) {
      return parseWithZod(formData, {
        schema,
      });
    },
    shouldValidate: 'onBlur',
    shouldRevalidate: 'onInput',
  });

  return (
    <>
      <AccountTitle linkBack="/account/locations" heading="Opret en lokation" />

      <AccountContent>
        <Form method="POST" {...getFormProps(form)}>
          <Stack>
            <RadioGroup
              label={'Hvilken type location vil du oprette?'}
              field={fields.locationType}
              data={[
                {
                  label: 'Opret en fast arbejdslokation.',
                  value: 'origin',
                },
                {
                  label:
                    'Opret en mobil arbejdslokation (Du vil kører til kunden).',
                  value: 'destination',
                },
              ]}
              data-testid="location-type-input"
            />

            <TextInput
              label="Navn"
              placeholder="BySisters"
              {...getInputProps(fields.name, {type: 'text'})}
              data-testid="name-input"
            />

            <AddressAutocompleteInput
              label={
                fields.locationType.value === 'destination'
                  ? 'Hvor vil du kører fra?'
                  : 'Hvor skal kunden køre hen til?'
              }
              placeholder="Sigridsvej 45, 8220 Brabrand"
              {...getInputProps(fields.fullAddress, {type: 'text'})}
              data-testid="address-input"
            />

            {fields.locationType.value === 'destination' ? (
              <input
                {...getInputProps(fields.originType, {
                  type: 'hidden',
                })}
              />
            ) : (
              <Select
                label="Arbejdsstedstype"
                defaultValue={fields.originType.initialValue}
                data={[
                  {value: 'commercial', label: 'Butik'},
                  {value: 'home', label: 'Eget sted'},
                ]}
                {...getInputProps(fields.originType, {type: 'text'})}
                data-testid="origin-type-input"
              />
            )}

            <NumericInput
              field={fields.startFee}
              label="Udgifter for turen"
              suffix=" kr"
              hidden={fields.locationType.value !== 'destination'}
              data-testid="start-fee-input"
            />

            <NumericInput
              field={fields.distanceHourlyRate}
              label="Timepris for kørsel"
              suffix=" kr"
              hidden={fields.locationType.value !== 'destination'}
              data-testid="hourly-rate-input"
            />

            <NumericInput
              field={fields.fixedRatePerKm}
              label="Pris pr. kilometer"
              suffix=" kr"
              hidden={fields.locationType.value !== 'destination'}
              data-testid="fixed-rate-input"
            />

            <NumericInput
              field={fields.distanceForFree}
              label="Afstanden der køres gratis, inden takstberegningen påbegyndes."
              suffix=" km"
              hidden={fields.locationType.value !== 'destination'}
              data-testid="distance-free-input"
            />

            <NumericInput
              field={fields.minDriveDistance}
              label="Minimum der skal køres for at acceptere en kørselsopgave"
              suffix=" km"
              hidden={fields.locationType.value !== 'destination'}
              data-testid="min-drive-distance-input"
            />

            <NumericInput
              field={fields.maxDriveDistance}
              label="Maximum der køres"
              suffix=" km"
              hidden={fields.locationType.value !== 'destination'}
              data-testid="max-drive-distance-input"
            />

            <SubmitButton>Tilføj</SubmitButton>
          </Stack>
        </Form>
      </AccountContent>
    </>
  );
}
