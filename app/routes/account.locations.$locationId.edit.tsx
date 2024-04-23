import {getFormProps, getInputProps, useForm} from '@conform-to/react';
import {Form, Link, useActionData, useLoaderData} from '@remix-run/react';

import {
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
} from '@shopify/remix-oxygen';
import {getBookingShopifyApi} from '~/lib/api/bookingShopifyApi';
import {getCustomer} from '~/lib/get-customer';
import {customerLocationUpdateBody} from '~/lib/zod/bookingShopifyApi';

import {parseWithZod} from '@conform-to/zod';
import {
  Anchor,
  Button,
  Group,
  Select,
  Stack,
  Text,
  TextInput,
} from '@mantine/core';
import {jsonWithSuccess, redirectWithSuccess} from 'remix-toast';
import {AccountContent} from '~/components/account/AccountContent';
import {AccountTitle} from '~/components/account/AccountTitle';
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

  const formData = await request.formData();
  const submission = parseWithZod(formData, {schema});

  if (submission.status !== 'success') {
    return submission.reply();
  }

  try {
    const response = await getBookingShopifyApi().customerLocationUpdate(
      customerId,
      params.locationId || '',
      submission.value,
    );

    await context.storefront.cache?.delete(
      `${baseURL}/customer/${customerId}/locations`,
    );

    return redirectWithSuccess(
      `/account/locations/${response.payload._id}/edit`,
      {
        message: 'Lokation er opdateret!',
      },
    );
  } catch (error) {
    return submission.reply();
  }
};

export async function loader({context, params}: LoaderFunctionArgs) {
  const customerId = await getCustomer({context});

  const {locationId} = params;
  if (!locationId) {
    throw new Error('Missing scheduleHandle param');
  }

  const response = await getBookingShopifyApi().customerLocationGet(
    customerId,
    locationId,
  );

  return jsonWithSuccess(response.payload, {message: 'Location er opdateret!'});
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
      <AccountTitle linkBack="/account/locations" heading={defaultValue.name}>
        <Button
          variant="outline"
          radius="xl"
          color="black"
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
          action={`../${defaultValue._id}/destroy`}
          style={{display: 'inline-block'}}
        >
          <Button
            variant="outline"
            radius="xl"
            color="red"
            type="submit"
            data-testid={`delete-button-${defaultValue._id}`}
          >
            Slet
          </Button>
        </Form>
      </AccountTitle>

      <AccountContent>
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
                data-testid="origin-type-input"
              />
            )}

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
              <SubmitButton>Opdatere</SubmitButton>
              <Text>eller</Text>
              <Anchor
                component={Link}
                to="/account/locations"
                data-testid="back-link"
              >
                Tilbage
              </Anchor>
            </Group>
          </Stack>
        </Form>
      </AccountContent>
    </>
  );
}
