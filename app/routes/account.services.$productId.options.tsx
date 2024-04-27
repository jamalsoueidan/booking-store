import {Form, useActionData, useLoaderData} from '@remix-run/react';
import {
  json,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
} from '@shopify/remix-oxygen';

import {getCustomer} from '~/lib/get-customer';
import {customerLocationCreateBody} from '~/lib/zod/bookingShopifyApi';

import {getFormProps, useForm} from '@conform-to/react';
import {parseWithZod} from '@conform-to/zod';
import {Flex, Select, Stack, Text} from '@mantine/core';
import {redirectWithSuccess} from 'remix-toast';
import {SubmitButton} from '~/components/form/SubmitButton';
import {PRODUCT_TAG_OPTIONS_QUERY} from '~/graphql/storefront/ProductTagOptions';

const schema = customerLocationCreateBody;

export const action = async ({request, context}: ActionFunctionArgs) => {
  const customerId = await getCustomer({context});

  const formData = await request.formData();
  const submission = parseWithZod(formData, {schema});

  if (submission.status !== 'success') {
    return submission.reply();
  }

  try {
    return redirectWithSuccess('.', {
      message: 'Lokation er nu oprettet!',
    });
  } catch (error) {
    return submission.reply();
  }
};

export async function loader({context}: LoaderFunctionArgs) {
  await context.customerAccount.handleAuthStatus();

  const {storefront} = context;

  const {products} = await storefront.query(PRODUCT_TAG_OPTIONS_QUERY);

  return json({products, defaultValue: {}});
}

export default function Component() {
  const lastResult = useActionData<typeof action>();
  const {products, defaultValue} = useLoaderData<typeof loader>();

  const [form, fields] = useForm({
    lastResult,
    defaultValue,
    onValidate({formData}) {
      return parseWithZod(formData, {
        schema,
      });
    },
    shouldValidate: 'onBlur',
    shouldRevalidate: 'onInput',
  });

  return (
    <Form method="POST" {...getFormProps(form)}>
      <Stack>
        <Flex direction="column" gap="md">
          <Stack gap="0" style={{flex: 1}}>
            <Text fw="bold">Valg muligheder:</Text>
            <Text>
              Hvilken valg mulighed vil du tilføje til den her ydelse??
            </Text>
          </Stack>
          <div style={{flex: 1}}>
            <Select
              data={products.nodes.map((p) => ({value: p.id, label: p.title}))}
              placeholder="-"
              allowDeselect={false}
              data-testid="options-select"
            />
          </div>
        </Flex>

        <SubmitButton>Tilføj</SubmitButton>
      </Stack>
    </Form>
  );
}
