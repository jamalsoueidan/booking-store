import {
  FormProvider,
  getFormProps,
  getSelectProps,
  useForm,
} from '@conform-to/react';
import {parseWithZod} from '@conform-to/zod';
import {Flex, Select, Stack} from '@mantine/core';
import {Form, useActionData, useLoaderData} from '@remix-run/react';
import {
  json,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
} from '@shopify/remix-oxygen';
import {z} from 'zod';
import {SelectSearchable} from '~/components/form/SelectSearchable';

import {SubmitButton} from '~/components/form/SubmitButton';
import {SwitchGroupLocations} from '~/components/form/SwitchGroupLocations';

import {getBookingShopifyApi} from '~/lib/api/bookingShopifyApi';

import {parseGid} from '@shopify/hydrogen';
import {useState} from 'react';
import {redirectWithSuccess} from 'remix-toast';
import {AccountContent} from '~/components/account/AccountContent';
import {AccountTitle} from '~/components/account/AccountTitle';
import {NumericInput} from '~/components/form/NumericInput';
import {parseTE} from '~/lib/clean';
import {createOrFindProductVariant} from '~/lib/create-or-find-variant';
import {getCustomer} from '~/lib/get-customer';
import {customerProductAddBody} from '~/lib/zod/bookingShopifyApi';
import {COLLECTIONS_QUERY} from './categories';

const schema = customerProductAddBody
  .omit({
    variantId: true,
    selectedOptions: true,
    price: true,
    compareAtPrice: true,
    productHandle: true,
  })
  .extend({
    scheduleId: z.string().min(1),
    price: z.number(),
    compareAtPrice: z.number(),
  });

type DefaultValues = z.infer<typeof schema>;

export const action = async ({request, context}: ActionFunctionArgs) => {
  const customerId = await getCustomer({context});
  const formData = await request.formData();
  const submission = parseWithZod(formData, {
    schema,
  });

  if (submission.status !== 'success') {
    return submission.reply();
  }

  try {
    const variant = await createOrFindProductVariant({
      productId: submission.value.productId,
      price: submission.value.price,
      compareAtPrice: submission.value.compareAtPrice,
      storefront: context.storefront,
    });

    await getBookingShopifyApi().customerProductAdd(customerId, {
      ...submission.value,
      ...variant,
      compareAtPrice: variant.compareAtPrice,
    });

    return redirectWithSuccess(
      `/account/services/${submission.value.productId}`,
      {
        message: 'Ydelsen er nu oprettet!',
      },
    );
  } catch (error) {
    return submission.reply();
  }
};

export async function loader({context}: LoaderFunctionArgs) {
  const customerId = await getCustomer({context});

  const {collections} = await context.storefront.query(COLLECTIONS_QUERY, {
    variables: {first: 20, endCursor: null},
  });

  const schedule = await getBookingShopifyApi().customerScheduleList(
    customerId,
  );

  const locations = await getBookingShopifyApi().customerLocationList(
    customerId,
  );

  const findDefaultLocation = locations.payload[0];

  return json({
    locations: locations.payload,
    schedules: schedule.payload,
    collections,
    defaultValue: {
      scheduleId: schedule.payload[0]._id,
      compareAtPrice: 0,
      price: 0,
      locations: [
        {
          location: findDefaultLocation?._id,
          locationType: findDefaultLocation?.locationType,
        },
      ],
    } as DefaultValues,
  });
}

export default function AccountServicesCreate() {
  const {locations, defaultValue, schedules, collections} =
    useLoaderData<typeof loader>();
  const lastResult = useActionData<typeof action>();
  const [collectionId, setCollectionId] = useState<string | null>(null);

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
      <AccountTitle linkBack="/account/services" heading="Opret en ydelse" />
      <AccountContent>
        <FormProvider context={form.context}>
          <Form method="post" {...getFormProps(form)}>
            <Stack>
              <Select
                onChange={setCollectionId}
                data={collections.nodes.map((c) => ({
                  value: parseGid(c.id).id,
                  label: parseTE(c.title),
                }))}
                label="Vælge behandlingskategori"
              />
              <SelectSearchable
                label="Hvilken ydelse vil du tilbyde?"
                placeholder="Vælg ydelse"
                collectionId={collectionId}
                disabled={collectionId === null}
                field={fields.productId}
              />

              <Flex gap="md">
                <NumericInput
                  field={fields.price}
                  label="Pris"
                  required
                  hideControls={true}
                  style={{flex: 1}}
                />
                <NumericInput
                  field={fields.compareAtPrice}
                  label="Før-pris"
                  hideControls={true}
                  style={{flex: 1}}
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
              <SubmitButton>Tilføj ny ydelse</SubmitButton>
            </Stack>
          </Form>
        </FormProvider>
      </AccountContent>
    </>
  );
}
