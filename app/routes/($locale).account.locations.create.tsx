import {Form, Link, useActionData} from '@remix-run/react';
import {
  json,
  redirect,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
} from '@shopify/remix-oxygen';

import {getCustomer} from '~/lib/get-customer';
import {customerLocationCreateBody} from '~/lib/zod/bookingShopifyApi';

import {
  conform,
  useForm,
  useInputEvent,
  type FieldConfig,
} from '@conform-to/react';
import {parse} from '@conform-to/zod';
import {
  ActionIcon,
  Divider,
  Flex,
  Radio,
  Stack,
  TextInput,
  Title,
} from '@mantine/core';
import {parseGid} from '@shopify/hydrogen';
import {IconArrowLeft} from '@tabler/icons-react';
import {useRef, useState} from 'react';
import {AddressAutocompleteInput} from '~/components/AddressAutocompleteInput';
import {SubmitButton} from '~/components/form/SubmitButton';
import {getBookingShopifyApi} from '~/lib/api/bookingShopifyApi';

export async function loader({context}: LoaderFunctionArgs) {
  const customerAccessToken = await context.session.get('customerAccessToken');
  if (!customerAccessToken) {
    return redirect('/account/login');
  }
  return json({});
}

export const action = async ({request, context}: ActionFunctionArgs) => {
  const customer = await getCustomer({context});

  const formData = await request.formData();
  const submission = parse(formData, {schema: customerLocationCreateBody});

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

  const [form, fields] = useForm({
    lastSubmission,
    defaultValue: {
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
    },
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
          <RadioGroup onChange={setLocationType} {...fields.locationType} />
          <TextInput
            label="Navn"
            placeholder="BySisters"
            {...conform.input(fields.name)}
          />
          <AddressAutocompleteInput
            label={
              locationType === 'destination'
                ? 'Hvor vil du kører fra?'
                : 'Hvor skal kunden køre til?'
            }
            placeholder="Sigridsvej 45, 8220 Brabrand"
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

function RadioGroup({
  onChange,
  ...config
}: FieldConfig<string> & {onChange: (value: string) => void}) {
  const [value, setValue] = useState(config.defaultValue ?? '');

  const shadowInputRef = useRef<HTMLInputElement>(null);

  const control = useInputEvent({
    ref: shadowInputRef,
    onReset: () => setValue(config.defaultValue ?? ''),
  });

  // https://conform.guide/checkbox-and-radio-group
  return (
    <>
      <input
        ref={shadowInputRef}
        {...conform.input(config, {hidden: true})}
        onChange={(e) => setValue(e.target.value)}
      />
      <Radio.Group
        label="Hvilken type location vil du oprette?"
        value={value}
        onChange={(value: string) => {
          control.change(value);
          onChange(value);
        }}
      >
        <Radio
          mt="xs"
          mb="xs"
          label="Opret en fast arbejdslokation."
          value="origin"
        />
        <Radio
          label="Opret en mobil arbejdslokation (Du vil kører til kunden)."
          value="destination"
        />
      </Radio.Group>
    </>
  );
}
