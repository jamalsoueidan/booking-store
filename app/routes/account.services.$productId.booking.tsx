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
import PeriodInput from '~/components/form/PeriodInput';
import {SubmitButton} from '~/components/form/SubmitButton';
import {getBookingShopifyApi} from '~/lib/api/bookingShopifyApi';
import {baseURL} from '~/lib/api/mutator/query-client';
import {getCustomer} from '~/lib/get-customer';
import {customerProductUpdateBody} from '~/lib/zod/bookingShopifyApi';

const schema = customerProductUpdateBody;

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
    await getBookingShopifyApi().customerProductUpdate(
      customerId,
      productId,
      submission.value,
    );

    await context.storefront.cache?.delete(
      `${baseURL}/customer/${customerId}/products`,
    );

    return redirectWithSuccess(`/account/services/${productId}/advanced`, {
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

  const {payload: customerProduct} =
    await getBookingShopifyApi().customerProductGet(customerId, productId);

  return json({
    defaultValue: customerProduct,
  });
}

export default function EditAddress() {
  const {defaultValue} = useLoaderData<typeof loader>();

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

  return (
    <FormProvider context={form.context}>
      <Form method="post" {...getFormProps(form)}>
        <Flex
          direction="column"
          gap={{base: 'sm', sm: 'lg'}}
          w={{base: '100%', sm: '50%'}}
        >
          <input {...getInputProps(fields.scheduleId, {type: 'hidden'})} />

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
