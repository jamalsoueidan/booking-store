import {
  FormProvider,
  getFormProps,
  getInputProps,
  useForm,
} from '@conform-to/react';
import {parseWithZod} from '@conform-to/zod';
import {Flex, Stack, Text, TextInput} from '@mantine/core';
import {Form, useActionData, useLoaderData} from '@remix-run/react';
import {
  json,
  redirect,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
} from '@shopify/remix-oxygen';
import PeriodInput from '~/components/form/PeriodInput';
import {SubmitButton} from '~/components/form/SubmitButton';
import {FlexInnerForm} from '~/components/tiny/FlexInnerForm';
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
      `${baseURL}/customer/${customerId}/product/${productId}`,
    );

    return redirect('.');
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
    await getBookingShopifyApi().customerProductGet(
      customerId,
      productId,
      context,
    );

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
        <FlexInnerForm>
          <Flex direction={{base: 'column', md: 'row'}} gap="md">
            <Stack gap="0" style={{flex: 1}}>
              <Text fw="bold">Behandlingstid</Text>
              <Text>Hvor langtid varer behandlingen</Text>
            </Stack>
            <div style={{flex: 1}}>
              <TextInput
                w="50%"
                rightSection="min"
                {...getInputProps(fields.duration, {type: 'number'})}
              />
            </div>
          </Flex>

          <Flex direction={{base: 'column', md: 'row'}} gap="md">
            <Stack gap="0" style={{flex: 1}}>
              <Text fw="bold">Pausetid</Text>
              <Text>
                Hvor lang pause ønsker du at holde efter behandlingen?
              </Text>
            </Stack>
            <div style={{flex: 1}}>
              <TextInput
                w="50%"
                rightSection="min"
                {...getInputProps(fields.breakTime, {type: 'number'})}
              />
            </div>
          </Flex>

          <Flex direction={{base: 'column', md: 'row'}} gap="md">
            <Stack gap="0" style={{flex: 1}}>
              <Text fw="bold">Bookingaccept</Text>
              <Text>
                Hvor langt ude i fremtiden vil du acceptere bookinger?
              </Text>
            </Stack>
            <div style={{flex: 1}}>
              <PeriodInput
                field={fields.bookingPeriod}
                data={[
                  {value: 'months', label: 'Måneder'},
                  {value: 'weeks', label: 'Uger'},
                ]}
              />
            </div>
          </Flex>

          <Flex direction={{base: 'column', md: 'row'}} gap="md">
            <Stack gap="0" style={{flex: 1}}>
              <Text fw="bold">Responsivitet</Text>
              <Text>Hvor hurtigt kan du være klar?</Text>
            </Stack>
            <div style={{flex: 1}}>
              <PeriodInput
                field={fields.noticePeriod}
                data={[
                  {value: 'days', label: 'Dage'},
                  {value: 'hours', label: 'Timer'},
                ]}
              />
            </div>
          </Flex>

          <SubmitButton>Gem ændringer</SubmitButton>
        </FlexInnerForm>
      </Form>
    </FormProvider>
  );
}
