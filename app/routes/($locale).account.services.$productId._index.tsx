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
import {AccountContent} from '~/components/account/AccountContent';
import {AccountTitle} from '~/components/account/AccountTitle';
import {NumericInput} from '~/components/form/NumericInput';
import PeriodInput from '~/components/form/PeriodInput';
import {SubmitButton} from '~/components/form/SubmitButton';
import {SwitchGroupLocations} from '~/components/form/SwitchGroupLocations';
import {PRODUCT_QUERY_ID} from '~/data/queries';
import {getBookingShopifyApi} from '~/lib/api/bookingShopifyApi';
import {getCustomer} from '~/lib/get-customer';

import {customerProductUpsertBody} from '~/lib/zod/bookingShopifyApi';
import {type ActionReturnType} from './($locale).api.account.services.$productId.create-variant';

const schema = customerProductUpsertBody
  .omit({
    variantId: true,
    price: true,
    compareAtPrice: true,
    productHandle: true,
    selectedOptions: true,
  })
  .extend({
    scheduleId: z.string().min(1),
    price: z.number(),
    compareAtPrice: z.number(),
  });

export const action = async ({
  request,
  params,
  context,
}: ActionFunctionArgs) => {
  const customer = await getCustomer({context});

  const {productId} = params;
  if (!productId) {
    throw new Response('Missing productId param', {status: 404});
  }

  const formData = await request.formData();
  const submission = parseWithZod(formData, {
    schema,
  });

  if (submission.status !== 'success') {
    return submission.reply();
  }

  try {
    const values = submission.value;
    const actionResponse = await fetch(
      `${
        new URL(request.url).origin
      }/api/account/services/${productId}/create-variant`,
      {
        method: 'POST',
        body: JSON.stringify(values),
      },
    );

    const response: ActionReturnType =
      (await actionResponse.json()) as ActionReturnType;

    await getBookingShopifyApi().customerProductUpsert(customer.id, productId, {
      ...values,
      ...response,
      compareAtPrice: response.compareAtPrice,
    });

    return redirect(`/account/services/${productId}`);
  } catch (error) {
    return submission.reply();
  }
};

export async function loader({context, params}: LoaderFunctionArgs) {
  const customer = await getCustomer({context});

  const {productId} = params;
  if (!productId) {
    throw new Error('Missing productHandle param, check route filename');
  }

  const schedules = await getBookingShopifyApi().customerScheduleList(
    customer.id,
  );

  const locations = await getBookingShopifyApi().customerLocationList(
    customer.id,
  );

  const {payload: customerProduct} =
    await getBookingShopifyApi().customerProductGet(customer.id, productId);

  const data = await context.storefront.query(PRODUCT_QUERY_ID, {
    variables: {
      Id: `gid://shopify/Product/${productId}`,
      country: context.storefront.i18n.country,
      language: context.storefront.i18n.language,
    },
  });

  if (!data?.product?.id) {
    throw new Response('product', {status: 404});
  }

  return json({
    defaultValue: {
      ...customerProduct,
      price: parseInt(customerProduct.price.amount),
      compareAtPrice: customerProduct.compareAtPrice?.amount
        ? parseInt(customerProduct.compareAtPrice?.amount)
        : 0,
      variantId: customerProduct.variantId.toString(),
      productId: customerProduct.productId.toString(),
    },
    locations: locations.payload,
    schedules: schedules.payload,
    selectedProduct: data.product,
  });
}

export default function EditAddress() {
  const {locations, schedules, selectedProduct, defaultValue} =
    useLoaderData<typeof loader>();

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
      <AccountTitle
        linkBack="/account/services"
        heading={<>Redigere {selectedProduct.title}</>}
      />

      <AccountContent>
        <FormProvider context={form.context}>
          <Form method="put" {...getFormProps(form)}>
            <Stack>
              <TextInput
                label="Hvilken ydelse vil du tilbyde?"
                disabled
                value={selectedProduct.title}
              />

              <Flex gap="md">
                <NumericInput
                  field={fields.price}
                  label="Pris"
                  required
                  w={'25%'}
                  hideControls={true}
                />
                <NumericInput
                  field={fields.compareAtPrice}
                  label="Før-pris"
                  w={'25%'}
                  hideControls={true}
                />
              </Flex>

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

              <Flex gap="md">
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
                label="Hvor hurtigt kan du være klar?"
                data={[
                  {value: 'days', label: 'Dage'},
                  {value: 'hours', label: 'Timer'},
                ]}
              />
              <SubmitButton>Opdatere</SubmitButton>
            </Stack>
          </Form>
        </FormProvider>
      </AccountContent>
    </>
  );
}
