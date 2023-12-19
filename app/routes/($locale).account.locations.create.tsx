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
  NumberInput,
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
  const submission = parse(formData, {schema});

  if (submission.intent !== 'submit' || !submission.value) {
    return json(submission);
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
      <Divider my={{base: 'xs', md: 'md'}} />

      <Form method="POST">
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
              <NumberInput
                label="Udgifter for turen"
                {...conform.input(fields.startFee)}
                type={undefined}
                allowNegative={false}
                allowDecimal={false}
                leftSection=" kr"
              />

              <NumberInput
                label="Timepris for kørsel"
                {...conform.input(fields.distanceHourlyRate)}
                type={undefined}
                allowNegative={false}
                allowDecimal={false}
                leftSection=" kr"
              />

              <NumberInput
                label="Pris pr. kilometer"
                {...conform.input(fields.fixedRatePerKm)}
                type={undefined}
                allowNegative={false}
                allowDecimal={false}
                leftSection=" kr"
              />

              <NumberInput
                label="Afstanden der køres gratis, inden takstberegningen påbegyndes."
                {...conform.input(fields.distanceForFree)}
                type={undefined}
                allowNegative={false}
                allowDecimal={false}
                leftSection=" km"
              />

              <NumberInput
                label="Minimum der skal køres for at acceptere en kørselsopgave"
                {...conform.input(fields.minDriveDistance)}
                type={undefined}
                allowNegative={false}
                allowDecimal={false}
                leftSection=" km"
              />

              <NumberInput
                label="Maximum der køres"
                {...conform.input(fields.maxDriveDistance)}
                type={undefined}
                allowNegative={false}
                allowDecimal={false}
                leftSection=" km"
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
