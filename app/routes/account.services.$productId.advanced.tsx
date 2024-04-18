import {
  FormProvider,
  getFormProps,
  getInputProps,
  useForm,
} from '@conform-to/react';
import {parseWithZod} from '@conform-to/zod';
import {Flex, TextInput} from '@mantine/core';
import {Form, useActionData, useLoaderData} from '@remix-run/react';
import {
  json,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
} from '@shopify/remix-oxygen';
import {redirectWithSuccess} from 'remix-toast';
import {z} from 'zod';
import PeriodInput from '~/components/form/PeriodInput';
import {SubmitButton} from '~/components/form/SubmitButton';
import {PRODUCT_QUERY_ID} from '~/data/queries';
import {getBookingShopifyApi} from '~/lib/api/bookingShopifyApi';
import {createOrFindProductVariant} from '~/lib/create-or-find-variant';
import {getCustomer} from '~/lib/get-customer';

import {customerProductUpsertBody} from '~/lib/zod/bookingShopifyApi';

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

    await getBookingShopifyApi().customerProductUpsert(customerId, productId, {
      ...values,
      ...variant,
      compareAtPrice: variant.compareAtPrice,
    });

    return redirectWithSuccess(`/account/services/${productId}`, {
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
  );

  const locations = await getBookingShopifyApi().customerLocationList(
    customerId,
  );

  const {payload: customerProduct} =
    await getBookingShopifyApi().customerProductGet(customerId, productId);

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
    <FormProvider context={form.context}>
      <Form method="put" {...getFormProps(form)}>
        <Flex
          direction="column"
          gap={{base: 'sm', sm: 'lg'}}
          w={{base: '100%', sm: '50%'}}
        >
          <Flex gap={{base: 'sm', sm: 'lg'}}>
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
              {value: 'weeks', label: 'Uger'},
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
        </Flex>
      </Form>
    </FormProvider>
  );
}
