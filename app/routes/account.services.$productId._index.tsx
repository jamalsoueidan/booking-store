import {
  FormProvider,
  getFormProps,
  getInputProps,
  getSelectProps,
  useForm,
} from '@conform-to/react';
import {parseWithZod} from '@conform-to/zod';
import {Divider, Flex, Select, Stack, Text, Title} from '@mantine/core';
import {Form, useActionData, useLoaderData} from '@remix-run/react';
import {
  json,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
} from '@shopify/remix-oxygen';
import {redirectWithSuccess} from 'remix-toast';
import {z} from 'zod';
import {NumericInput} from '~/components/form/NumericInput';
import {SubmitButton} from '~/components/form/SubmitButton';
import {SwitchGroupLocations} from '~/components/form/SwitchGroupLocations';
import {FlexInnerForm} from '~/components/tiny/FlexInnerForm';
import {getBookingShopifyApi} from '~/lib/api/bookingShopifyApi';
import {baseURL} from '~/lib/api/mutator/query-client';
import {createOrFindProductVariant} from '~/lib/create-or-find-variant';
import {getCustomer} from '~/lib/get-customer';
import {customerProductUpdateBody} from '~/lib/zod/bookingShopifyApi';

const schema = customerProductUpdateBody.extend({
  price: z.number(),
  compareAtPrice: z.number(),
});

export const action = async ({
  request,
  params,
  context,
}: ActionFunctionArgs) => {
  const customerId = await getCustomer({context});

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
    const variant = await createOrFindProductVariant({
      productId,
      price: values.price,
      compareAtPrice: values.compareAtPrice,
      storefront: context.storefront,
    });

    await getBookingShopifyApi().customerProductUpdate(customerId, productId, {
      ...values,
      ...variant,
      compareAtPrice: variant.compareAtPrice,
    });

    await context.storefront.cache?.delete(
      `${baseURL}/customer/${customerId}/products`,
    );

    return redirectWithSuccess('.', {
      message: 'Ydelsen er nu opdateret!',
    });
  } catch (error) {
    return submission.reply();
  }
};

export async function loader({context, params}: LoaderFunctionArgs) {
  const customerId = await getCustomer({context});

  const {productId} = params;
  if (!productId) {
    throw new Error('Missing productHandle param, check route filename');
  }

  const schedules = await getBookingShopifyApi().customerScheduleList(
    customerId,
    context,
  );

  const locations = await getBookingShopifyApi().customerLocationList(
    customerId,
    context,
  );

  const {payload: customerProduct} =
    await getBookingShopifyApi().customerProductGet(customerId, productId);

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
  });
}

export default function EditAddress() {
  const {locations, schedules, defaultValue} = useLoaderData<typeof loader>();
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
    <FormProvider context={form.context}>
      <Form method="post" {...getFormProps(form)}>
        <FlexInnerForm>
          <input {...getInputProps(fields.scheduleId, {type: 'hidden'})} />

          <input {...getInputProps(fields.productId, {type: 'hidden'})} />

          <Title order={3}>Pris</Title>
          <Flex direction={{base: 'column', md: 'row'}} gap="md">
            <Stack gap="0" style={{flex: 1}}>
              <Text fw="bold">Pris:</Text>
              <Text>Den pris, kunden skal betale.</Text>
            </Stack>
            <div style={{flex: 1}}>
              <NumericInput
                field={fields.price}
                required
                hideControls={true}
                data-testid="price-input"
                rightSection="DKK"
                rightSectionWidth={50}
                style={{width: '100px'}}
              />
            </div>
          </Flex>
          <Flex direction={{base: 'column', md: 'row'}} gap="md">
            <Stack gap="0" style={{flex: 1}}>
              <Text fw="bold">Før-pris:</Text>
              <Text>Hvad har prisen været tidligere?</Text>
            </Stack>
            <div style={{flex: 1}}>
              <NumericInput
                field={fields.compareAtPrice}
                hideControls={true}
                rightSection="DKK"
                rightSectionWidth={50}
                data-testid="compare-at-price-input"
                style={{width: '100px'}}
              />
            </div>
          </Flex>

          <Divider />
          <Title order={3}>Lokation</Title>
          <Flex direction={{base: 'column', md: 'row'}} gap="md">
            <Stack gap="0" style={{flex: 1}}>
              <Text fw="bold">Lokation for denne ydelse:</Text>
              <Text>Tilknyt en eller flere lokationer</Text>
            </Stack>
            <SwitchGroupLocations
              style={{flex: 1}}
              description="Mindst (1) skal være valgt."
              field={fields.locations}
              data={locations}
            />
          </Flex>

          <Divider />
          <Title order={3}>Vagtplan</Title>
          <Flex direction={{base: 'column', md: 'row'}} gap="md">
            <Stack gap="0" style={{flex: 1}}>
              <Text fw="bold">Vagtplan for denne ydelse:</Text>
              <Text>Tilknyt denne ydelse med en vagtplan</Text>
            </Stack>
            <Select
              style={{flex: 1}}
              data={selectSchedules}
              {...getSelectProps(fields.scheduleId)}
              allowDeselect={false}
              defaultValue={fields.scheduleId.initialValue}
              data-testid="schedules-select"
            />
          </Flex>

          <SubmitButton>Gem ændringer</SubmitButton>
        </FlexInnerForm>
      </Form>
    </FormProvider>
  );
}
