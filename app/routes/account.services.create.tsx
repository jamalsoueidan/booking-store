import {
  FormProvider,
  getFormProps,
  getSelectProps,
  useForm,
} from '@conform-to/react';
import {parseWithZod} from '@conform-to/zod';

import {Form, useActionData, useFetcher, useLoaderData} from '@remix-run/react';
import {
  json,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
} from '@shopify/remix-oxygen';
import {z} from 'zod';

import {useInputControl, type FieldMetadata} from '@conform-to/react';
import {
  Combobox,
  Divider,
  Flex,
  Highlight,
  Loader,
  ScrollArea,
  Select,
  Stack,
  Text,
  TextInput,
  Title,
  useCombobox,
} from '@mantine/core';
import {redirect, type SerializeFrom} from '@remix-run/server-runtime';

import {useCallback, useEffect, useRef, useState} from 'react';
import {SubmitButton} from '~/components/form/SubmitButton';
import {SwitchGroupLocations} from '~/components/form/SwitchGroupLocations';
import type {loader as accountApiProductsLoader} from '~/routes/account.api.products';

import {getBookingShopifyApi} from '~/lib/api/bookingShopifyApi';

import {CacheLong, parseGid} from '@shopify/hydrogen';
import {redirectWithSuccess} from 'remix-toast';
import {AccountContent} from '~/components/account/AccountContent';
import {AccountTitle} from '~/components/account/AccountTitle';
import {NumericInput} from '~/components/form/NumericInput';
import {FlexInnerForm} from '~/components/tiny/FlexInnerForm';
import {baseURL} from '~/lib/api/mutator/query-client';
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

    await context.storefront.cache?.delete(
      `${baseURL}/customer/${customerId}/products`,
    );

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
    cache: CacheLong(),
  });

  const {payload: schedules} =
    await getBookingShopifyApi().customerScheduleList(customerId, context);

  const {payload: locations} =
    await getBookingShopifyApi().customerLocationList(customerId, context);

  if (locations.length === 0 || schedules.length === 0) {
    return redirect('/account/services');
  }

  const findDefaultLocation = locations[0];

  return json({
    locations,
    schedules,
    collections,
    defaultValue: {
      scheduleId: schedules[0]._id,
      compareAtPrice: 0,
      price: 0,
      locations: [
        {
          location: findDefaultLocation?._id,
          locationType: findDefaultLocation?.locationType,
          originType: findDefaultLocation?.originType,
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
            <FlexInnerForm>
              <Flex direction={{base: 'column', md: 'row'}} gap="md">
                <Stack gap="0" style={{flex: 1}}>
                  <Text fw="bold">Kategori:</Text>
                  <Text>
                    Vælg den kategori for den ydelse, du ønsker at tilbyde?
                  </Text>
                </Stack>
                <div style={{flex: 1}}>
                  <Select
                    onChange={setCollectionId}
                    data={collections.nodes.map((c) => ({
                      value: parseGid(c.id).id,
                      label: parseTE(c.title),
                    }))}
                    placeholder="-"
                    allowDeselect={false}
                    data-testid="category-select"
                  />
                </div>
              </Flex>

              <Flex direction={{base: 'column', md: 'row'}} gap="md">
                <Stack gap="0" style={{flex: 1}}>
                  <Text fw="bold">Ydelse:</Text>
                  <Text>Vælg ydelse inden for den valgte kategori</Text>
                </Stack>
                <div style={{flex: 1}}>
                  <SelectSearchable
                    placeholder="-"
                    collectionId={collectionId}
                    field={fields.productId}
                  />
                </div>
              </Flex>

              <Divider />
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
              <SubmitButton>Tilføj ny ydelse</SubmitButton>
            </FlexInnerForm>
          </Form>
        </FormProvider>
      </AccountContent>
    </>
  );
}

export type SelectSearchableProps = {
  placeholder?: string;
  field: FieldMetadata<string>;
  collectionId?: string | null;
};

export function SelectSearchable({
  placeholder,
  field,
  collectionId,
}: SelectSearchableProps) {
  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
  });

  const textInput = useRef<HTMLInputElement>(null);
  const control = useInputControl(field);

  const fetcher =
    useFetcher<Awaited<SerializeFrom<typeof accountApiProductsLoader>>>();
  const [title, setTitle] = useState('');

  const fetchOptions = useCallback(
    (keyword: string) => {
      fetcher.load(
        `/account/api/products?keyword=${keyword}&collectionId=${collectionId}`,
      );
    },
    [collectionId, fetcher],
  );

  useEffect(() => {
    setTitle('');
    control.change('');
    if (collectionId) {
      fetchOptions('');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [collectionId, setTitle, control.change]);

  const options = fetcher.data?.map((item) => (
    <Combobox.Option value={parseGid(item.id).id} key={item.id}>
      <Highlight
        highlight={parseGid(item.id).id === field.value ? item.title : ''}
        size="sm"
      >
        {item.title}
      </Highlight>
    </Combobox.Option>
  ));

  return (
    <>
      <Combobox
        onOptionSubmit={(optionValue) => {
          const node = fetcher.data?.find(
            (item) => parseGid(item.id).id === optionValue,
          );
          if (node?.title) {
            setTitle(node?.title);
          }
          control.change(optionValue);
          combobox.closeDropdown();
          textInput.current?.blur();
        }}
        withinPortal={false}
        store={combobox}
      >
        <Combobox.Target>
          <TextInput
            ref={textInput}
            placeholder={placeholder}
            disabled={!collectionId}
            value={title}
            onChange={(event) => {
              setTitle(event.currentTarget.value);
              fetchOptions(event.currentTarget.value);
              control.change('');
              combobox.resetSelectedOption();
              combobox.openDropdown();
            }}
            onClick={() => {
              combobox.openDropdown();
            }}
            onFocus={() => {
              combobox.openDropdown();
              if (!fetcher.data) {
                fetchOptions(title);
              }
            }}
            onBlur={() => {
              combobox.closeDropdown();
            }}
            rightSection={fetcher.state === 'loading' && <Loader size={18} />}
            data-testid="product-select"
          />
        </Combobox.Target>

        <Combobox.Dropdown hidden={fetcher.data === null}>
          <Combobox.Options>
            <ScrollArea.Autosize mah={200} type="scroll">
              {!fetcher.data || fetcher.data?.length === 0 ? (
                <Combobox.Empty>Ingen produkt med dette navn</Combobox.Empty>
              ) : (
                options
              )}
            </ScrollArea.Autosize>
          </Combobox.Options>
          <Combobox.Footer>
            <Text fz="xs" c="dimmed">
              Kontakt os, for at tilføje manglende behandlinger.
            </Text>
          </Combobox.Footer>
        </Combobox.Dropdown>
      </Combobox>
    </>
  );
}
