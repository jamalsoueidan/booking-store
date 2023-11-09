import {Form, Link, useActionData, useLoaderData} from '@remix-run/react';
import {
  json,
  redirect,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
} from '@shopify/remix-oxygen';

import {getCustomer} from '~/lib/get-customer';
import {customerLocationCreateBody} from '~/lib/zod/bookingShopifyApi';

import {conform, useForm} from '@conform-to/react';
import {parse} from '@conform-to/zod';
import {
  ActionIcon,
  Divider,
  Flex,
  Stack,
  TextInput,
  Title,
} from '@mantine/core';
import {parseGid} from '@shopify/hydrogen';
import {IconArrowLeft} from '@tabler/icons-react';
import {useState} from 'react';
import {AddressAutocompleteInput} from '~/components/AddressAutocompleteInput';
import {RadioGroup} from '~/components/form/RadioGroup';
import {SubmitButton} from '~/components/form/SubmitButton';
import {getBookingShopifyApi} from '~/lib/api/bookingShopifyApi';

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
  const submission = parse(formData, {schema});

  if (submission.intent !== 'submit' || !submission.value) {
    return json(submission);
  }

  try {
    const response = await getBookingShopifyApi().customerLocationCreate(
      parseGid(customer.id).id,
      submission.value,
    );

    return redirect(`/account/locations/${response.payload._id}/edit`);
  } catch (error) {
    return json(submission);
  }
};

export default function Component() {
  const lastSubmission = useActionData<typeof action>();
  const defaultValue = useLoaderData<typeof loader>();

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

  const [locationType, setLocationType] = useState(
    fields.locationType.defaultValue,
  );

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
        <Title>Opret en lokation</Title>
      </Flex>
      <Divider my="md" />

      <Form method="POST" {...form.props}>
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
            error={fields.name.error}
            {...conform.input(fields.name)}
          />

          <AddressAutocompleteInput
            label={
              locationType === 'destination'
                ? 'Hvor vil du kører fra?'
                : 'Hvor skal kunden køre til?'
            }
            placeholder="Sigridsvej 45, 8220 Brabrand"
            error={fields.fullAddress.error}
            {...conform.input(fields.fullAddress)}
          />

          <input type="hidden" {...conform.input(fields.originType)} />

          {locationType === 'destination' ? (
            <>
              <TextInput
                label="Udgifter for turen"
                {...conform.input(fields.startFee)}
              />

              <TextInput
                label="Timepris for kørsel"
                {...conform.input(fields.distanceHourlyRate)}
              />

              <TextInput
                label="Pris pr. kilometer"
                {...conform.input(fields.fixedRatePerKm)}
              />

              <TextInput
                label="Afstanden der køres gratis, inden takstberegningen påbegyndes."
                {...conform.input(fields.distanceForFree)}
              />

              <TextInput
                label="Minimum der skal køres for at acceptere en kørselsopgave"
                {...conform.input(fields.minDriveDistance)}
              />

              <TextInput
                label="Maximum der køres"
                {...conform.input(fields.maxDriveDistance)}
              />
            </>
          ) : (
            <>
              <input type="hidden" name="startFee" value="0" />
              <input type="hidden" name="distanceForFree" value="0" />
              <input type="hidden" name="fixedRatePerKm" value="0" />
              <input type="hidden" name="distanceHourlyRate" value="0" />
              <input type="hidden" name="minDriveDistance" value="0" />
              <input type="hidden" name="maxDriveDistance" value="500" />
            </>
          )}

          <SubmitButton>Tilføj</SubmitButton>
        </Stack>
      </Form>
    </>
  );
}
