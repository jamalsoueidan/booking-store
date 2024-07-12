import {Form, useActionData, useLoaderData} from '@remix-run/react';
import {
  json,
  redirect,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
} from '@shopify/remix-oxygen';

import {getCustomer} from '~/lib/get-customer';
import {customerLocationCreateBody} from '~/lib/zod/bookingShopifyApi';

import {
  FormProvider,
  getFormProps,
  getInputProps,
  useForm,
} from '@conform-to/react';
import {parseWithZod} from '@conform-to/zod';
import {Container, rem, Stack, TextInput} from '@mantine/core';
import {AccountContent} from '~/components/account/AccountContent';
import {AccountTitle} from '~/components/account/AccountTitle';
import {AddressAutocompleteInput} from '~/components/form/AddressAutocompleteInput';
import {NumericInput} from '~/components/form/NumericInput';
import {RadioGroup} from '~/components/form/RadioGroup';
import {SubmitButton} from '~/components/form/SubmitButton';
import {getBookingShopifyApi} from '~/lib/api/bookingShopifyApi';
import {CustomerLocationBaseLocationType} from '~/lib/api/model';

const schema = customerLocationCreateBody;

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

    return redirect('/business/locations');
  } catch (error) {
    return submission.reply();
  }
};

export async function loader({context}: LoaderFunctionArgs) {
  await context.customerAccount.handleAuthStatus();

  return json({
    name: '',
    locationType: CustomerLocationBaseLocationType.commercial,
    fullAddress: '',
    distanceHourlyRate: '500',
    fixedRatePerKm: '20',
    distanceForFree: '4',
    minDriveDistance: '0',
    maxDriveDistance: '300',
    startFee: 0,
  });
}

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
    <Container size="md" my={{base: rem(80), sm: rem(100)}}>
      <AccountTitle
        linkBack="/business/locations"
        heading="Opret en lokation"
      />

      <AccountContent>
        <FormProvider context={form.context}>
          <Form method="POST" {...getFormProps(form)}>
            <Stack>
              <RadioGroup
                label={'Hvilken type location vil du oprette?'}
                field={fields.locationType}
                data={[
                  {
                    label: 'Arbejder fra salon/klink',
                    value: CustomerLocationBaseLocationType.commercial,
                  },
                  {
                    label: 'Arbejder hjemmefra',
                    value: CustomerLocationBaseLocationType.home,
                  },
                  {
                    label: 'Jeg vil kører ud til kunden.',
                    value: CustomerLocationBaseLocationType.destination,
                  },
                  {
                    label:
                      'Jeg vil mødes online via videochat eller telefonopkald',
                    value: CustomerLocationBaseLocationType.virtual,
                  },
                ]}
                data-testid="location-type-input"
              />

              <TextInput
                label="Navn"
                placeholder="BySisters"
                data-testid="name-input"
                {...getInputProps(fields.name, {type: 'text'})}
                error={fields.name.errors}
              />

              <AddressAutocompleteInput
                label={
                  fields.locationType.value === 'destination'
                    ? 'Hvor vil du kører fra?'
                    : 'Hvor skal kunden køre hen til?'
                }
                data-testid="address-input"
                {...getInputProps(fields.fullAddress, {type: 'text'})}
              />

              <NumericInput
                field={fields.startFee}
                label="Udgifter for turen"
                rightSection="kr"
                hidden={
                  fields.locationType.value !==
                  CustomerLocationBaseLocationType.destination
                }
                data-testid="start-fee-input"
              />

              <NumericInput
                field={fields.distanceHourlyRate}
                label="Timepris for kørsel"
                rightSection="kr"
                hidden={
                  fields.locationType.value !==
                  CustomerLocationBaseLocationType.destination
                }
                data-testid="hourly-rate-input"
              />

              <NumericInput
                field={fields.fixedRatePerKm}
                label="Pris pr. kilometer"
                rightSection="kr"
                hidden={
                  fields.locationType.value !==
                  CustomerLocationBaseLocationType.destination
                }
                data-testid="fixed-rate-input"
              />

              <NumericInput
                field={fields.distanceForFree}
                label="Afstanden der køres gratis, inden takstberegningen påbegyndes."
                suffix=" km"
                hidden={
                  fields.locationType.value !==
                  CustomerLocationBaseLocationType.destination
                }
                data-testid="distance-free-input"
              />

              <NumericInput
                field={fields.minDriveDistance}
                label="Minimum der skal køres for at acceptere en kørselsopgave"
                suffix=" km"
                hidden={
                  fields.locationType.value !==
                  CustomerLocationBaseLocationType.destination
                }
                data-testid="min-drive-distance-input"
              />

              <NumericInput
                field={fields.maxDriveDistance}
                label="Maximum der køres"
                suffix=" km"
                hidden={
                  fields.locationType.value !==
                  CustomerLocationBaseLocationType.destination
                }
                data-testid="max-drive-distance-input"
              />

              <SubmitButton>Tilføj</SubmitButton>
            </Stack>
          </Form>
        </FormProvider>
      </AccountContent>
    </Container>
  );
}
