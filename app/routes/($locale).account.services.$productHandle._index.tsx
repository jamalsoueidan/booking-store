import {conform, useForm} from '@conform-to/react';
import {parse} from '@conform-to/zod';
import {
  ActionIcon,
  Divider,
  Flex,
  Select,
  Stack,
  TextInput,
  Title,
} from '@mantine/core';
import {Form, Link, useActionData, useLoaderData} from '@remix-run/react';
import {
  json,
  redirect,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
} from '@shopify/remix-oxygen';
import {IconArrowLeft} from '@tabler/icons-react';
import {z} from 'zod';
import PeriodInput from '~/components/form/PeriodInput';
import {RadioGroupVariantsProduct} from '~/components/form/RadioGroupVariantProducts';
import {SubmitButton} from '~/components/form/SubmitButton';
import {SwitchGroupLocations} from '~/components/form/SwitchGroupLocations';
import {PRODUCT_SERVICE_ITEM_FRAGMENT} from '~/data/fragments';
import {getBookingShopifyApi} from '~/lib/api/bookingShopifyApi';
import {getCustomer} from '~/lib/get-customer';

import {customerProductUpsertBody} from '~/lib/zod/bookingShopifyApi';

const schema = customerProductUpsertBody.extend({
  scheduleId: z.string().min(1),
});

export const action = async ({
  request,
  params,
  context,
}: ActionFunctionArgs) => {
  const customer = await getCustomer({context});

  const {productHandle} = params;
  if (!productHandle) {
    throw new Error('Missing productHandle param, check route filename');
  }

  const formData = await request.formData();
  const submission = parse(formData, {
    schema,
  });

  if (submission.intent !== 'submit' || !submission.value) {
    return json(submission);
  }

  try {
    const response = await getBookingShopifyApi().customerProductUpsert(
      customer.id,
      productHandle,
      submission.value,
    );

    return redirect(`/account/services/${response.payload.productId}`);
  } catch (error) {
    return json(submission);
  }
};

export async function loader({context, params}: LoaderFunctionArgs) {
  const customer = await getCustomer({context});

  const {productHandle} = params;
  if (!productHandle) {
    throw new Error('Missing productHandle param, check route filename');
  }

  const schedules = await getBookingShopifyApi().customerScheduleList(
    customer.id,
  );

  const locations = await getBookingShopifyApi().customerLocationList(
    customer.id,
  );

  const {payload: customerProduct} =
    await getBookingShopifyApi().customerProductGet(customer.id, productHandle);

  const data = await context.storefront.query(PRODUCT_QUERY, {
    variables: {
      Id: `gid://shopify/Product/${productHandle}`,
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

  const lastSubmission = useActionData<typeof action>();
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

  const selectSchedules = schedules.map((schedule) => ({
    value: schedule._id,
    label: schedule.name,
  }));

  return (
    <>
      <Flex direction={'row'} align={'center'}>
        <Link to="/account/services">
          <ActionIcon
            variant="transparent"
            size="xl"
            aria-label="Back"
            color="black"
          >
            <IconArrowLeft style={{width: '70%', height: '70%'}} stroke={1.5} />
          </ActionIcon>
        </Link>
        <Title>Redigere {selectedProduct.title} </Title>
      </Flex>
      <Divider my="md" />

      <Form method="put" {...form.props}>
        <Stack>
          <TextInput
            label="Hvilken ydelse vil du tilbyde?"
            disabled
            value={selectedProduct.title}
          />

          <RadioGroupVariantsProduct
            label="Hvad skal ydelsen koste?"
            product={selectedProduct}
            field={fields.variantId}
          />

          <SwitchGroupLocations
            label="Fra hvilken lokation(er) vil du tilbyde den ydelse?"
            description="Mindst (1) skal være valgt."
            field={fields.locations}
            data={locations}
          />

          <Select
            label="Hvilken vagtplan vil du tilknytte den ydelse på."
            data={selectSchedules}
            {...conform.select(fields.scheduleId)}
            defaultValue={fields.scheduleId.defaultValue}
          />

          <Flex align={'flex-end'} gap="xs">
            <TextInput
              w="50%"
              label="Behandlingstid:"
              rightSection="min"
              {...conform.input(fields.duration)}
            />
            <TextInput
              w="50%"
              label="Pause efter behandling:"
              rightSection="min"
              {...conform.input(fields.breakTime)}
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
    </>
  );
}

const PRODUCT_QUERY = `#graphql
  ${PRODUCT_SERVICE_ITEM_FRAGMENT}
  query AccountTreatmentProduct(
    $country: CountryCode
    $language: LanguageCode
    $Id: ID!
  ) @inContext(country: $country, language: $language) {
    product(id: $Id) {
      ...ProductServiceItem
    }
  }
`;
