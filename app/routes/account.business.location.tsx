import {Form, useActionData} from '@remix-run/react';
import {
  json,
  redirect,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
} from '@shopify/remix-oxygen';

import {getCustomer} from '~/lib/get-customer';

import {FormProvider, getFormProps, useForm} from '@conform-to/react';
import {parseWithZod} from '@conform-to/zod';
import {
  Container,
  Flex,
  Progress,
  rem,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import {IconBuildingStore, IconCar, IconHome} from '@tabler/icons-react';
import {useTranslation} from 'react-i18next';
import {AddressAutocompleteInput} from '~/components/form/AddressAutocompleteInput';
import {RadioGroup} from '~/components/form/RadioGroup';
import {SubmitButton} from '~/components/form/SubmitButton';
import {CUSTOMER_DETAILS_QUERY} from '~/graphql/customer-account/CustomerDetailsQuery';
import {getBookingShopifyApi} from '~/lib/api/bookingShopifyApi';
import {CustomerLocationBaseLocationType} from '~/lib/api/model';
import {customerLocationCreateBody} from '~/lib/zod/bookingShopifyApi';
import {
  createValidateAddressSchema,
  validateAddress,
} from './api.address-autocomplete';

export const action = async ({request, context}: ActionFunctionArgs) => {
  const customerId = await getCustomer({context});

  const formData = await request.formData();
  const submission = await parseWithZod(formData, {
    schema: createValidateAddressSchema({
      customerLocationCreateBody: customerLocationCreateBody.pick({
        locationType: true,
        fullAddress: true,
      }),
      validateAddress,
    }),
    async: true,
  });

  if (submission.status !== 'success') {
    return submission.reply();
  }

  try {
    await getBookingShopifyApi().customerLocationCreate(customerId, {
      ...submission.value,
      name: 'Eksempel',
      distanceHourlyRate: 500,
      fixedRatePerKm: 20,
      distanceForFree: 4,
      minDriveDistance: 0,
      maxDriveDistance: 50,
      startFee: 0,
    });

    return redirect('/account/business/schedule');
  } catch (error) {
    return submission.reply();
  }
};

export async function loader({context}: LoaderFunctionArgs) {
  await context.customerAccount.handleAuthStatus();

  const {data} = await context.customerAccount.query(CUSTOMER_DETAILS_QUERY);

  if (data.customer.tags.includes('business-step2')) {
    return redirect('/account/business/schedule');
  }

  return json(null);
}

export default function Component() {
  const {t} = useTranslation(['account', 'global', 'zod']);
  const lastResult = useActionData<typeof action>();

  const [form, {fullAddress, locationType}] = useForm({
    lastResult,
    defaultValue: {
      locationType: CustomerLocationBaseLocationType.commercial,
      fullAddress: '',
    },
    onValidate({formData}) {
      return parseWithZod(formData, {
        schema: createValidateAddressSchema({
          customerLocationCreateBody: customerLocationCreateBody.pick({
            locationType: true,
            fullAddress: true,
          }),
        }),
      });
    },
    shouldValidate: 'onInput',
  });

  return (
    <>
      <Progress value={30} size="sm" />
      <FormProvider context={form.context}>
        <Form
          method="POST"
          {...getFormProps(form)}
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Container size="md" flex="1" p={{base: 'md', sm: rem(70)}}>
            <Stack mb="lg">
              <div>
                <Text c="dimmed" tt="uppercase" fz="sm">
                  {t('account:business.step', {step: 2})}
                </Text>
                <Title fw="600">{t('account:business.location.title')}</Title>
              </div>
            </Stack>

            <Stack gap="lg">
              <RadioGroup
                label={''}
                field={locationType}
                data={[
                  {
                    label: t('account:business.location.commercial'),
                    value: CustomerLocationBaseLocationType.commercial,
                    icon: <IconHome size={20} />,
                  },
                  {
                    label: t('account:business.location.home'),
                    value: CustomerLocationBaseLocationType.home,
                    icon: <IconBuildingStore size={20} />,
                  },
                  {
                    label: t('account:business.location.destination'),
                    value: CustomerLocationBaseLocationType.destination,
                    icon: <IconCar size={20} />,
                  },
                ]}
                data-testid="location-type-input"
              />

              <AddressAutocompleteInput
                label={
                  locationType.value === 'destination'
                    ? t('account:business.location.drive_from')
                    : t('account:business.location.drive_to')
                }
                data-testid="address-input"
                name={fullAddress.name}
              />
            </Stack>
          </Container>

          <Flex
            justify="flex-end"
            align="center"
            pos="sticky"
            bottom="0"
            p="md"
            style={{boxShadow: '0 -2px 10px rgba(0, 0, 0, 0.1)'}}
          >
            <SubmitButton size="md" disabled={!form.valid}>
              {t('account:business.location.submit')}
            </SubmitButton>
          </Flex>
        </Form>
      </FormProvider>
    </>
  );
}
