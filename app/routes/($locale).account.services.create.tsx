import {
  FormProvider,
  getFormProps,
  getInputProps,
  getSelectProps,
  useForm,
} from '@conform-to/react';
import {parseWithZod} from '@conform-to/zod';
import {Flex, Select, Stack, TextInput} from '@mantine/core';
import {Form, useActionData, useLoaderData} from '@remix-run/react';
import {
  json,
  redirect,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
} from '@shopify/remix-oxygen';
import {z} from 'zod';
import PeriodInput from '~/components/form/PeriodInput';
import {RadioGroupVariantsProduct} from '~/components/form/RadioGroupVariantProducts';
import {SelectSearchable} from '~/components/form/SelectSearchable';

import {SubmitButton} from '~/components/form/SubmitButton';
import {SwitchGroupLocations} from '~/components/form/SwitchGroupLocations';

import {PRODUCT_ITEM_FRAGMENT} from '~/data/fragments';
import {VARIANTS_QUERY_ID} from '~/data/queries';
import {getBookingShopifyApi} from '~/lib/api/bookingShopifyApi';

import {AccountContent} from '~/components/account/AccountContent';
import {AccountTitle} from '~/components/account/AccountTitle';
import {isEqualGid} from '~/data/isEqualGid';
import {getCustomer} from '~/lib/get-customer';
import {customerProductUpsertBody} from '~/lib/zod/bookingShopifyApi';

const schema = customerProductUpsertBody
  .omit({
    selectedOptions: true,
    price: true,
    compareAtPrice: true,
    productHandle: true,
  })
  .extend({
    productId: z.string().min(1),
    scheduleId: z.string().min(1),
  });

type DefaultValues = z.infer<typeof schema>;

export const action = async ({request, context}: ActionFunctionArgs) => {
  const {storefront} = context;
  const customer = await getCustomer({context});

  const formData = await request.formData();
  const submission = parseWithZod(formData, {
    schema,
  });

  if (submission.status !== 'success') {
    return submission.reply();
  }

  try {
    const {productId, ...body} = submission.value;

    const variants = await storefront.query(VARIANTS_QUERY_ID, {
      variables: {handle: `gid://shopify/Product/${productId}`},
    });

    const variant = variants.product?.variants.nodes.find((v) =>
      isEqualGid(v.id, body.variantId),
    );

    if (!variant) {
      throw new Response('Variant not found', {status: 404});
    }

    const response = await getBookingShopifyApi().customerProductUpsert(
      customer.id,
      productId,
      {
        ...body,
        selectedOptions: variant.selectedOptions[0],
        productHandle: variant.product.handle,
        price: variant.price,
        ...(variant.compareAtPrice
          ? {compareAtPrice: variant.compareAtPrice}
          : {}),
      },
    );

    return redirect(`/account/services/${response.payload.productId}`);
  } catch (error) {
    return submission.reply();
  }
};

export async function loader({context}: LoaderFunctionArgs) {
  const customer = await getCustomer({context});

  const schedule = await getBookingShopifyApi().customerScheduleList(
    customer.id,
  );

  const locations = await getBookingShopifyApi().customerLocationList(
    customer.id,
  );

  const findDefaultLocation = locations.payload.find((l) => l.isDefault) || {
    _id: '',
    locationType: 'origin',
  };

  return json({
    locations: locations.payload,
    schedules: schedule.payload,
    defaultValue: {
      scheduleId: schedule.payload[0]._id,
      duration: 60,
      breakTime: 15,
      bookingPeriod: {
        unit: 'months',
        value: 4,
      },
      noticePeriod: {
        unit: 'days',
        value: 1,
      },
      locations: [
        {
          location: findDefaultLocation?._id,
          locationType: findDefaultLocation?.locationType,
        },
      ],
    } as DefaultValues,
  });
}

export default function AccountServicesCreate() {
  const {locations, defaultValue, schedules} = useLoaderData<typeof loader>();
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

  const selectSchedules = schedules.map((schedule) => ({
    value: schedule._id,
    label: schedule.name,
  }));

  return (
    <>
      <AccountTitle linkBack="/account/services" heading="Opret en ydelse" />
      <AccountContent>
        <FormProvider context={form.context}>
          <Form method="post" {...getFormProps(form)}>
            <Stack>
              <SelectSearchable
                label="Hvilken ydelse vil du tilbyde?"
                placeholder="Vælg ydelse"
                field={fields.productId}
              />

              {fields.productId.value && (
                <RadioGroupVariantsProduct
                  label="Hvad skal ydelsen koste?"
                  productId={fields.productId.value}
                  field={fields.variantId}
                />
              )}

              <SwitchGroupLocations
                label="Fra hvilken lokation(er) vil du tilbyde den ydelse?"
                description="Mindst (1) skal være valgt."
                field={fields.locations}
                data={locations}
              />

              <Select
                label="Hvilken vagtplan vil du tilknytte den ydelse på."
                data={selectSchedules}
                {...getSelectProps(fields.scheduleId)}
                allowDeselect={false}
                defaultValue={fields.scheduleId.initialValue}
              />

              <Flex align={'flex-end'} gap="xs">
                <TextInput
                  w="50%"
                  label="Behandlingstid:"
                  rightSection="min"
                  {...getInputProps(fields.duration, {type: 'number'})}
                />
                <TextInput
                  w="50%"
                  label="Pause efter behandling:"
                  rightSection="min"
                  {...getInputProps(fields.breakTime, {type: 'number'})}
                />
              </Flex>

              <PeriodInput
                field={fields.bookingPeriod}
                label="Hvor langt ude i fremtiden vil du acceptere bookinger?"
                data={[
                  {value: 'months', label: 'Måneder'},
                  {value: 'hours', label: 'Timer'},
                ]}
              />

              <PeriodInput
                field={fields.noticePeriod}
                label="Minimum tid før ankomst en kunde kan booke online?"
                data={[
                  {value: 'days', label: 'Dage'},
                  {value: 'hours', label: 'Timer'},
                ]}
              />

              <SubmitButton>Tilføj ny ydelse</SubmitButton>
            </Stack>
          </Form>
        </FormProvider>
      </AccountContent>
    </>
  );
}

const ALL_PRODUCTS_QUERY = `#graphql
  ${PRODUCT_ITEM_FRAGMENT}
  query AllAccountServicesProducts(
    $country: CountryCode
    $language: LanguageCode
    $first: Int
    $query: String
  ) @inContext(country: $country, language: $language) {
    products(first: $first, query: $query) {
      nodes {
        ...ProductItem
      }
    }
  }
` as const;
