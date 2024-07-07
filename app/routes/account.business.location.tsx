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
import {
  Box,
  Container,
  Grid,
  Progress,
  rem,
  Stack,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import {redirectWithSuccess} from 'remix-toast';
import {AddressAutocompleteInput} from '~/components/form/AddressAutocompleteInput';
import {NumericInput} from '~/components/form/NumericInput';
import {RadioGroup} from '~/components/form/RadioGroup';
import {SubmitButton} from '~/components/form/SubmitButton';
import {getBookingShopifyApi} from '~/lib/api/bookingShopifyApi';
import {CustomerLocationBaseLocationType} from '~/lib/api/model';
import {baseURL} from '~/lib/api/mutator/query-client';
import {ControlDetails} from './account.business';

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

    await context.storefront.cache?.delete(
      `${baseURL}/customer/${customerId}/locations`,
    );

    return redirectWithSuccess('/business/locations', {
      message: 'Lokation er nu oprettet!',
    });
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
    <Box mt={rem(60)} mb={rem(100)}>
      <Progress value={20} size="sm" />
      <Container
        size="md"
        p={{base: 'md', sm: 'xl'}}
        pt={{base: 'md', sm: rem(80)}}
      >
        <Form method="POST" {...getFormProps(form)}>
          <Grid gutter="xl">
            <Grid.Col span={{base: 12}}>
              <Stack mb="lg">
                <div>
                  <Text c="dimmed" tt="uppercase" fz="sm">
                    Step 2
                  </Text>
                  <Title fw="600">Which type of business do you have?</Title>
                </div>
              </Stack>

              <Stack gap="lg">
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
                  placeholder="Sigridsvej 45, 8220 Brabrand"
                  data-testid="address-input"
                  error={fields.fullAddress.errors}
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
              </Stack>
            </Grid.Col>
            <ControlDetails>
              <SubmitButton size="md">
                <SubmitButton>Tilføj</SubmitButton>
              </SubmitButton>
            </ControlDetails>
          </Grid>
        </Form>
      </Container>
    </Box>
  );
}
