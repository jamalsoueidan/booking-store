import {
  FormProvider,
  getFormProps,
  getInputProps,
  getSelectProps,
  useForm,
} from '@conform-to/react';
import {parseWithZod} from '@conform-to/zod';
import {Flex, Select, TextInput} from '@mantine/core';
import {
  Form,
  useActionData,
  useLoaderData,
  useOutletContext,
} from '@remix-run/react';
import {
  json,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
} from '@shopify/remix-oxygen';
import {redirectWithSuccess} from 'remix-toast';
import {type ProductItemByIdQuery} from 'storefrontapi.generated';
import {z} from 'zod';
import {NumericInput} from '~/components/form/NumericInput';
import {SubmitButton} from '~/components/form/SubmitButton';
import {SwitchGroupLocations} from '~/components/form/SwitchGroupLocations';
import {getBookingShopifyApi} from '~/lib/api/bookingShopifyApi';
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
  const {selectedProduct} = useOutletContext<{
    selectedProduct: ProductItemByIdQuery['product'];
  }>();
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
        <Flex
          direction="column"
          gap={{base: 'sm', sm: 'lg'}}
          w={{base: '100%', sm: '50%'}}
        >
          <input {...getInputProps(fields.scheduleId, {type: 'hidden'})} />

          <TextInput
            label="Hvilken ydelse vil du tilbyde?"
            disabled
            value={selectedProduct?.title}
          />

          <Flex gap={{base: 'sm', sm: 'lg'}}>
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

          <SubmitButton>Opdatere</SubmitButton>
        </Flex>
      </Form>
    </FormProvider>
  );
}
