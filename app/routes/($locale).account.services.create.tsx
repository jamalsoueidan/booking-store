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
import {parseGid} from '@shopify/hydrogen';
import {
  json,
  redirect,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
} from '@shopify/remix-oxygen';
import {IconArrowLeft} from '@tabler/icons-react';
import {useState} from 'react';
import {z} from 'zod';
import PeriodInput from '~/components/form/PeriodInput';
import {RadioGroupVariantsProduct} from '~/components/form/RadioGroupVariantProducts';
import {SelectSearchable} from '~/components/form/SelectSearchable';

import {SubmitButton} from '~/components/form/SubmitButton';
import {SwitchGroupLocations} from '~/components/form/SwitchGroupLocations';

import {PRODUCT_SIMPLE} from '~/data/fragments';
import {getBookingShopifyApi} from '~/lib/api/bookingShopifyApi';
import type {CustomerProductUpsertBody} from '~/lib/api/model';

import {getCustomer} from '~/lib/get-customer';
import {customerProductUpsertBody} from '~/lib/zod/bookingShopifyApi';

const schema = customerProductUpsertBody.extend({
  productId: z.string().min(1),
  scheduleId: z.string().min(1),
});

export const action = async ({request, context}: ActionFunctionArgs) => {
  const customer = await getCustomer({context});

  const formData = await request.formData();
  const submission = parse(formData, {
    schema,
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
    defaultValue: {
      productId: '',
      variantId: 0,
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
    } as CustomerProductUpsertBody,
  });
}

export default function AccountServicesCreate() {
  const {locations, storeProducts, defaultValue, schedules} =
    useLoaderData<typeof loader>();

  const lastSubmission = useActionData<typeof action>();
  const [productId, setProductId] = useState<string | null>('');

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

  const selectServices = storeProducts.nodes.map((product) => ({
    value: parseGid(product.id).id,
    label: product.title,
  }));

  const selectSchedules = schedules.map((schedule) => ({
    value: schedule._id,
    label: schedule.name,
  }));

  const selectedProduct = storeProducts.nodes.find(
    (p) => parseGid(p.id).id === productId,
  );

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
        <Title>Opret en ydelse</Title>
      </Flex>
      <Divider my="md" />

      <Form method="post" {...form.props}>
        <Stack>
          <SelectSearchable
            label="Hvilken ydelse vil du tilbyde?"
            placeholder="Vælg ydelse"
            data={selectServices}
            field={fields.productId}
            onChange={setProductId}
          />
          {selectedProduct && (
            <RadioGroupVariantsProduct
              label="Hvad skal ydelsen koste?"
              product={selectedProduct}
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
            label="Hvor mange bookingsperioder?"
            data={[
              {value: 'months', label: 'Måneder'},
              {value: 'hours', label: 'Timer'},
            ]}
          />

          <PeriodInput
            field={fields.noticePeriod}
            label="Hvor tidligst må en behandling bookes?"
            data={[
              {value: 'days', label: 'Dage'},
              {value: 'hours', label: 'Timer'},
            ]}
          />

          <SubmitButton>Tilføj ny ydelse</SubmitButton>
        </Stack>
      </Form>
    </>
  );
}

const ALL_PRODUCTS_QUERY = `#graphql
  ${PRODUCT_SIMPLE}
  query AllAccountServicesProducts(
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
