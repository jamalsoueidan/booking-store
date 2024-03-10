import {Form, useActionData, useLoaderData} from '@remix-run/react';
import {
  json,
  redirect,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
} from '@shopify/remix-oxygen';

import {getCustomer} from '~/lib/get-customer';
import {customerLocationCreateBody} from '~/lib/zod/bookingShopifyApi';

import {getFormProps, getInputProps, useForm} from '@conform-to/react';
import {parseWithZod} from '@conform-to/zod';
import {Stack, TextInput} from '@mantine/core';
import {parseGid} from '@shopify/hydrogen';
import {useState} from 'react';
import {AddressAutocompleteInput} from '~/components/AddressAutocompleteInput';
import {AccountContent} from '~/components/account/AccountContent';
import {AccountTitle} from '~/components/account/AccountTitle';
import {NumericInput} from '~/components/form/NumericInput';
import {RadioGroup} from '~/components/form/RadioGroup';
import {SubmitButton} from '~/components/form/SubmitButton';
import {getBookingShopifyApi} from '~/lib/api/bookingShopifyApi';
import {redirectWithNotification} from '~/lib/show-notification';

const schema = customerLocationCreateBody;

export async function loader({context}: LoaderFunctionArgs) {
  const customerAccessToken = await context.session.get('customerAccessToken');
  if (!customerAccessToken) {
    return redirect('/account/login');
  }
  return json({
    name: '',
    locationType: 'origin',
    fullAddress: '',
    originType: 'home',
    distanceHourlyRate: 500,
    fixedRatePerKm: 20,
    distanceForFree: 4,
    minDriveDistance: 0,
    maxDriveDistance: 300,
    startFee: 0,
  });
}

export const action = async ({request, context}: ActionFunctionArgs) => {
  const customer = await getCustomer({context});

  const formData = await request.formData();
  const submission = parseWithZod(formData, {schema});

  if (submission.status !== 'success') {
    return submission.reply();
  }

  try {
    const response = await getBookingShopifyApi().customerLocationCreate(
      parseGid(customer.id).id,
      submission.value,
    );

    return redirectWithNotification(context, {
      redirectUrl: `/account/locations`,
      title: 'Lokation',
      message: 'Lokation er nu oprettet!',
      color: 'green',
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

  const [locationType, setLocationType] = useState(
    fields.locationType.initialValue,
  );

  return (
    <>
      <AccountTitle linkBack="/account/locations" heading="Opret en lokation" />

      <AccountContent>
        <Form method="POST" {...getFormProps(form)}>
          <Stack>
            <RadioGroup
              label={'Hvilken type location vil du oprette?'}
              onChange={setLocationType}
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
            />

            <TextInput
              label="Navn"
              placeholder="BySisters"
              {...getInputProps(fields.name, {type: 'text'})}
            />

            <AddressAutocompleteInput
              label={
                locationType === 'destination'
                  ? 'Hvor vil du kører fra?'
                  : 'Hvor skal kunden køre til?'
              }
              placeholder="Sigridsvej 45, 8220 Brabrand"
              {...getInputProps(fields.fullAddress, {type: 'text'})}
            />

            <input
              {...getInputProps(fields.originType, {
                type: 'hidden',
              })}
            />

            <NumericInput
              field={fields.startFee}
              label="Udgifter for turen"
              suffix=" kr"
              hidden={locationType !== 'destination'}
            />

            <NumericInput
              field={fields.distanceHourlyRate}
              label="Timepris for kørsel"
              suffix=" kr"
              hidden={locationType !== 'destination'}
            />

            <NumericInput
              field={fields.fixedRatePerKm}
              label="Pris pr. kilometer"
              suffix=" kr"
              hidden={locationType !== 'destination'}
            />

            <NumericInput
              field={fields.distanceForFree}
              label="Afstanden der køres gratis, inden takstberegningen påbegyndes."
              suffix=" km"
              hidden={locationType !== 'destination'}
            />

            <NumericInput
              field={fields.minDriveDistance}
              label="Minimum der skal køres for at acceptere en kørselsopgave"
              suffix=" km"
              hidden={locationType !== 'destination'}
            />

            <NumericInput
              field={fields.maxDriveDistance}
              label="Maximum der køres"
              suffix=" km"
              hidden={locationType !== 'destination'}
            />

            <SubmitButton>Tilføj</SubmitButton>
          </Stack>
        </Form>
      </AccountContent>
    </>
  );
}
