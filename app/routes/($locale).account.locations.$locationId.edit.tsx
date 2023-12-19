import {conform, useForm} from '@conform-to/react';
import {parse} from '@conform-to/zod';
import {Form, useActionData, useLoaderData} from '@remix-run/react';

import {
  json,
  redirect,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
} from '@shopify/remix-oxygen';
import {getBookingShopifyApi} from '~/lib/api/bookingShopifyApi';
import {getCustomer} from '~/lib/get-customer';
import {customerLocationUpdateBody} from '~/lib/zod/bookingShopifyApi';

import {NumberInput, Stack, TextInput} from '@mantine/core';
import {parseGid} from '@shopify/hydrogen';
import {AddressAutocompleteInput} from '~/components/AddressAutocompleteInput';
import {AccountTitle} from '~/components/account/AccountTitle';
import {SubmitButton} from '~/components/form/SubmitButton';

const schema = customerLocationUpdateBody;

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
    const response = await getBookingShopifyApi().customerLocationUpdate(
      parseGid(customer.id).id,
      params.locationId || '',
      submission.value,
    );

    return redirect(`/account/locations/${response.payload._id}/edit`);
  } catch (error) {
    return json(submission);
  }
};

export async function loader({context, params}: LoaderFunctionArgs) {
  const customer = await getCustomer({context});

  const response = await getBookingShopifyApi().customerLocationGet(
    customer.id,
    params.locationId || '',
  );

  return json(response.payload);
}

export default function AccountLocationsEdit() {
  const defaultValue = useLoaderData<typeof loader>();
  const lastSubmission = useActionData<typeof action>();

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

  return (
    <>
      <AccountTitle
        linkBack="/account/locations"
        heading={
          defaultValue.originType === 'commercial'
            ? 'Redigere butik lokation'
            : 'Redigere hjemme lokation'
        }
      />

      <Form method="PUT" {...form.props}>
        <Stack>
          <TextInput
            label="Navn"
            placeholder="BySisters"
            {...conform.input(fields.name)}
          />
          <AddressAutocompleteInput
            label={
              defaultValue.locationType === 'destination'
                ? 'Hvor vil du kører fra?'
                : 'Hvor skal kunden køre til?'
            }
            placeholder="Sigridsvej 45, 8220 Brabrand"
            {...conform.input(fields.fullAddress)}
          />
          <input type="hidden" {...conform.input(fields.originType)} />
          {defaultValue.locationType === 'destination' ? (
            <>
              <NumberInput
                label="Udgifter for turen"
                {...conform.input(fields.startFee)}
                type={undefined}
                allowNegative={false}
                allowDecimal={false}
                suffix=" kr"
              />

              <NumberInput
                label="Timepris for kørsel"
                {...conform.input(fields.distanceHourlyRate)}
                type={undefined}
                allowNegative={false}
                allowDecimal={false}
                suffix=" kr"
              />

              <NumberInput
                label="Pris pr. kilometer"
                {...conform.input(fields.fixedRatePerKm)}
                type={undefined}
                allowNegative={false}
                allowDecimal={false}
                suffix=" kr"
              />

              <NumberInput
                label="Afstanden der køres gratis, inden takstberegningen påbegyndes."
                {...conform.input(fields.distanceForFree)}
                type={undefined}
                allowNegative={false}
                allowDecimal={false}
                suffix=" km"
              />

              <NumberInput
                label="Minimum der skal køres for at acceptere en kørselsopgave"
                {...conform.input(fields.minDriveDistance)}
                type={undefined}
                allowNegative={false}
                allowDecimal={false}
                suffix=" km"
              />

              <NumberInput
                label="Maximum der køres"
                {...conform.input(fields.maxDriveDistance)}
                type={undefined}
                allowNegative={false}
                allowDecimal={false}
                suffix=" km"
              />
            </>
          ) : (
            <>
              <input type="hidden" name="distanceForFree" value="0" />
              <input type="hidden" name="fixedRatePerKm" value="0" />
              <input type="hidden" name="distanceHourlyRate" value="0" />
              <input type="hidden" name="minDriveDistance" value="0" />
              <input type="hidden" name="maxDriveDistance" value="500" />
              <input type="hidden" name="startFee" value="0" />
            </>
          )}

          <SubmitButton>Opdatere</SubmitButton>
        </Stack>
      </Form>
    </>
  );
}
