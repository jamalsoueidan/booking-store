import {getFormProps, getInputProps, useForm} from '@conform-to/react';
import {Form, Link, useActionData, useLoaderData} from '@remix-run/react';

import {
  json,
  redirect,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
} from '@shopify/remix-oxygen';
import {getBookingShopifyApi} from '~/lib/api/bookingShopifyApi';
import {getCustomer} from '~/lib/get-customer';
import {customerLocationUpdateBody} from '~/lib/zod/bookingShopifyApi';

import {parseWithZod} from '@conform-to/zod';
import {Button, Select, Stack, TextInput} from '@mantine/core';
import {parseGid} from '@shopify/hydrogen';
import {AccountContent} from '~/components/account/AccountContent';
import {AccountTitle} from '~/components/account/AccountTitle';
import {AddressAutocompleteInput} from '~/components/form/AddressAutocompleteInput';
import {NumericInput} from '~/components/form/NumericInput';
import {SubmitButton} from '~/components/form/SubmitButton';

const schema = customerLocationUpdateBody;

export const action = async ({
  request,
  context,
  params,
}: ActionFunctionArgs) => {
  const customer = await getCustomer({context});

  const formData = await request.formData();
  const submission = parseWithZod(formData, {schema});

  if (submission.status !== 'success') {
    return submission.reply();
  }

  try {
    const response = await getBookingShopifyApi().customerLocationUpdate(
      parseGid(customer.id).id,
      params.locationId || '',
      submission.value,
    );

    return redirect(`/account/locations/${response.payload._id}/edit`);
  } catch (error) {
    return submission.reply();
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
    <>
      <AccountTitle
        linkBack="/account/locations"
        heading={
          defaultValue.originType === 'commercial'
            ? 'Redigere butik lokation'
            : 'Redigere hjemme lokation'
        }
      >
        <Button
          variant="light"
          component={Link}
          to={`https://www.google.com/maps/search/?api=1&query=${defaultValue.geoLocation.coordinates
            .reverse()
            .join(',')}`}
          target="_blank"
          rel="noreferrer"
        >
          Vis kort
        </Button>

        <Form
          method="post"
          action={`${defaultValue._id}/destroy`}
          style={{display: 'inline-block'}}
        >
          <Button
            variant="light"
            color="red"
            type="submit"
            data-cy={`delete-button-${defaultValue._id}`}
          >
            Slet {defaultValue.name}
          </Button>
        </Form>
      </AccountTitle>

      <AccountContent>
        <Form method="PUT" {...getFormProps(form)}>
          <Stack>
            <TextInput
              label="Navn"
              placeholder="BySisters"
              {...getInputProps(fields.name, {type: 'text'})}
              data-cy="name-input"
            />

            <AddressAutocompleteInput
              label={
                defaultValue.locationType === 'destination'
                  ? 'Hvor vil du kører fra?'
                  : 'Hvor skal kunden køre til?'
              }
              placeholder="Sigridsvej 45, 8220 Brabrand"
              {...getInputProps(fields.fullAddress, {type: 'text'})}
              data-cy="address-input"
            />

            {defaultValue.locationType === 'destination' ? (
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
                  {value: 'home', label: 'Hus/lejlighed'},
                  {value: 'commercial', label: 'Butik'},
                ]}
                {...getInputProps(fields.originType, {type: 'text'})}
                data-cy="origin-type-input"
              />
            )}

            <NumericInput
              field={fields.startFee}
              label="Udgifter for turen"
              suffix=" kr"
              hidden={defaultValue.locationType !== 'destination'}
              data-cy="start-fee-input"
            />

            <NumericInput
              field={fields.distanceHourlyRate}
              label="Timepris for kørsel"
              suffix=" kr"
              hidden={defaultValue.locationType !== 'destination'}
              data-cy="hourly-rate-input"
            />

            <NumericInput
              field={fields.fixedRatePerKm}
              label="Pris pr. kilometer"
              suffix=" kr"
              hidden={defaultValue.locationType !== 'destination'}
              data-cy="fixed-rate-input"
            />

            <NumericInput
              field={fields.distanceForFree}
              label="Afstanden der køres gratis, inden takstberegningen påbegyndes."
              suffix=" km"
              hidden={defaultValue.locationType !== 'destination'}
              data-cy="distance-free-input"
            />

            <NumericInput
              field={fields.minDriveDistance}
              label="Minimum der skal køres for at acceptere en kørselsopgave"
              suffix=" km"
              hidden={defaultValue.locationType !== 'destination'}
              data-cy="min-drive-distance-input"
            />

            <NumericInput
              field={fields.maxDriveDistance}
              label="Maximum der køres"
              suffix=" km"
              hidden={defaultValue.locationType !== 'destination'}
              data-cy="max-drive-distance-input"
            />

            <SubmitButton>Opdatere</SubmitButton>
          </Stack>
        </Form>
      </AccountContent>
    </>
  );
}
