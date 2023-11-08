import {conform, useForm} from '@conform-to/react';
import {parse} from '@conform-to/zod';
import {Select, Stack} from '@mantine/core';
import {Form, useActionData, useLoaderData} from '@remix-run/react';
import {parseGid} from '@shopify/hydrogen';
import {
  json,
  redirect,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
} from '@shopify/remix-oxygen';
import {z} from 'zod';
import ServiceProductForm from '~/components/Account/ServiceProductForm';
import {ServiceProductLocationsGroup} from '~/components/Account/ServiceProductLocationsGroup';
import {ServiceProductVariantSelector} from '~/components/Account/ServiceProductVariantSelector';
import {SubmitButton} from '~/components/form/SubmitButton';

import {PRODUCT_SIMPLE} from '~/data/fragments';
import {getBookingShopifyApi} from '~/lib/api/bookingShopifyApi';

import {getCustomer} from '~/lib/get-customer';
import {customerProductUpsertBody} from '~/lib/zod/bookingShopifyApi';

export const action = async ({request, context}: ActionFunctionArgs) => {
  const customer = await getCustomer({context});

  const formData = await request.formData();
  const submission = parse(formData, {
    schema: customerProductUpsertBody.extend({
      productId: z.string().min(3),
      scheduleId: z.string().min(3),
    }),
  });

  if (submission.intent !== 'submit' || !submission.value) {
    return json(submission);
  }

  try {
    const {productId, ...body} = submission.value;

    const response = await getBookingShopifyApi().customerProductUpsert(
      customer.id,
      productId,
      body,
    );

    return redirect(`/account/services/${response.payload.productId}`);
  } catch (error) {
    return json(submission);
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

  const {payload: productIds} =
    await getBookingShopifyApi().customerProductsListIds(customer.id);

  const query = productIds.map((id) => `-${id}`).join(' AND ');

  const data = await context.storefront.query(ALL_PRODUCTS_QUERY, {
    variables: {
      first: 50,
      query,
    },
  });

  return json({
    locations: locations.payload,
    storeProducts: data.products,
    schedules: schedule.payload,
    defaultValues: {
      productId: '',
      variantId: '',
      scheduleId: schedule.payload[0]._id,
      duration: '60',
      breakTime: '15',
      bookingPeriod: {
        unit: 'months',
        value: '4',
      },
      noticePeriod: {
        unit: 'days',
        value: '1',
      },
      locations: [
        {
          location: findDefaultLocation?._id,
          locationType: findDefaultLocation?.locationType,
        },
      ],
    },
  });
}

export default function EditAddress() {
  const {locations, storeProducts, defaultValues, schedules} =
    useLoaderData<typeof loader>();

  const lastSubmission = useActionData<typeof action>();

  const [form, fields] = useForm({
    lastSubmission,
    defaultValue: defaultValues,
  });

  const data = storeProducts.nodes.map((product) => ({
    value: parseGid(product.id).id,
    label: product.title,
  }));

  return (
    <Form method="post" {...form.props}>
      <Stack>
        <Select
          label="Vælg ydelse"
          data={data}
          {...conform.select(fields.productId)}
          defaultValue={defaultValues.productId}
        />

        <ServiceProductVariantSelector
          products={storeProducts.nodes}
          defaultValue={defaultValues.variantId}
        />
        <ServiceProductLocationsGroup locations={locations} />
        <ServiceProductForm
          defaultValues={defaultValues}
          schedules={schedules}
        />
        <SubmitButton>Tilføj ny ydelse</SubmitButton>
      </Stack>
    </Form>
  );
}

const ALL_PRODUCTS_QUERY = `#graphql
  ${PRODUCT_SIMPLE}
  query AllAccountCreateProducts(
    $country: CountryCode
    $language: LanguageCode
    $first: Int
    $query: String
  ) @inContext(country: $country, language: $language) {
    products(first: $first, query: $query) {
      nodes {
        ...ProductSimple
      }
    }
  }
`;
