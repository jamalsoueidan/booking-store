import {
  FormProvider,
  getFormProps,
  getSelectProps,
  useForm,
  useInputControl,
} from '@conform-to/react';
import {parseWithZod} from '@conform-to/zod';

import {
  ActionIcon,
  Autocomplete,
  Divider,
  Flex,
  Select,
  Stack,
  Switch,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import {Form, useActionData, useLoaderData} from '@remix-run/react';
import {redirect} from '@remix-run/server-runtime';
import {
  json,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
} from '@shopify/remix-oxygen';

import {useMemo, useState} from 'react';
import {SubmitButton} from '~/components/form/SubmitButton';
import {SwitchGroupLocations} from '~/components/form/SwitchGroupLocations';

import {getBookingShopifyApi} from '~/lib/api/bookingShopifyApi';

import {parseGid} from '@shopify/hydrogen';
import {IconX} from '@tabler/icons-react';
import {redirectWithSuccess} from 'remix-toast';
import {type z} from 'zod';
import {AccountContent} from '~/components/account/AccountContent';
import {AccountTitle} from '~/components/account/AccountTitle';
import {NumericInput} from '~/components/form/NumericInput';
import {TextEditor} from '~/components/richtext/TextEditor';
import {FlexInnerForm} from '~/components/tiny/FlexInnerForm';
import {baseURL} from '~/lib/api/mutator/query-client';
import {convertHTML} from '~/lib/convertHTML';
import {getCustomer} from '~/lib/get-customer';
import {customerProductAddBody} from '~/lib/zod/bookingShopifyApi';

const schema = customerProductAddBody.omit({descriptionHtml: true});

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
    const {payload: product} = await getBookingShopifyApi().customerProductAdd(
      customerId,
      {
        ...submission.value,
        descriptionHtml: convertHTML(submission.value.description || ''),
      },
    );

    await context.storefront.cache?.delete(
      `${baseURL}/customer/${customerId}/products`,
    );

    return redirectWithSuccess(`/account/services/${product.productId}`, {
      message: 'Ydelsen er nu oprettet!',
    });
  } catch (error) {
    return submission.reply();
  }
};

export async function loader({context}: LoaderFunctionArgs) {
  const customerId = await getCustomer({context});

  const {collection} = await context.storefront.query(COLLECTION);

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
    collection,
    defaultValue: {
      hideFromCombine: 'false',
      hideFromProfile: 'false',
      scheduleId: schedules[0]._id,
      compareAtPrice: {
        amount: '0',
        currencyCode: 'DKK',
      },
      price: {
        amount: '0',
        currencyCode: 'DKK',
      },
      locations: [
        {
          location: findDefaultLocation?._id,
          locationType: findDefaultLocation?.locationType,
          originType: findDefaultLocation?.originType,
        },
      ],
    } as z.infer<typeof schema>,
  });
}

export default function AccountServicesCreate() {
  const {locations, defaultValue, schedules, collection} =
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

  const hideFromProfile = useInputControl(fields.hideFromProfile);
  const hideFromCombine = useInputControl(fields.hideFromCombine);
  const titleInput = useInputControl(fields.title);
  const descriptionInput = useInputControl(fields.description);

  const collections = useMemo(
    () =>
      collection?.children?.references?.nodes.map((c) => ({
        value: c.id,
        label: c.title,
      })) || [],
    [collection?.children?.references?.nodes],
  );

  const selectedCollection = useMemo(
    () =>
      collection?.children?.references?.nodes.find(
        (c) => c.id === collectionId,
      ),
    [collection?.children?.references?.nodes, collectionId],
  );

  const products = useMemo(
    () => selectedCollection?.products.nodes.map((p) => p.title),
    [selectedCollection?.products.nodes],
  );

  const selectedProduct = useMemo(
    () =>
      selectedCollection?.products.nodes.find(
        (p) => p.title === titleInput.value,
      ),
    [selectedCollection?.products.nodes, titleInput.value],
  );

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
                    onChange={(value: string | null) => {
                      setCollectionId(value);
                      titleInput.change('');
                    }}
                    data={collections}
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
                  <Autocomplete
                    onChange={titleInput.change}
                    value={titleInput.value}
                    disabled={!collectionId}
                    data={products}
                    rightSection={
                      titleInput.value && titleInput.value.length > 0 ? (
                        <ActionIcon
                          variant="transparent"
                          color="gray"
                          aria-label="Settings"
                          onClick={() => {
                            titleInput.change('');
                          }}
                        >
                          <IconX />
                        </ActionIcon>
                      ) : null
                    }
                  />
                  <input
                    type="hidden"
                    name={fields.parentId.name}
                    value={parseGid(selectedProduct?.id).id}
                  />
                </div>
              </Flex>

              <Divider />

              <Title order={3}>Title & Beskrivelse</Title>

              <Flex direction={{base: 'column', md: 'row'}} gap="md">
                <Stack gap="0" style={{flex: 1}}>
                  <Text fw="bold">Title:</Text>
                  <Text>Title på ydelsen</Text>
                </Stack>
                <div style={{flex: 1}}>
                  <TextInput
                    defaultValue={titleInput.value}
                    disabled={!titleInput.value}
                    name={fields.title.name}
                  />
                </div>
              </Flex>

              <Flex direction={{base: 'column', md: 'row'}} gap="md">
                <Stack gap="0" style={{flex: 1}}>
                  <Text fw="bold">Beskrivelse:</Text>
                  <Text>Beskrive af ydelse</Text>
                </Stack>
                <div style={{flex: 1}}>
                  <TextEditor
                    content={selectedProduct?.descriptionHtml}
                    onUpdate={({editor}) => {
                      descriptionInput.change(JSON.stringify(editor.getJSON()));
                    }}
                  />
                </div>
              </Flex>

              <Flex direction={{base: 'column', md: 'row'}} gap="md">
                <Stack gap="0" style={{flex: 1}}>
                  <Text fw="bold">Skjul:</Text>
                  <Text>
                    Skjul ydelsen fra evt. profil eller kombinere siden?
                  </Text>
                </Stack>
                <Stack style={{flex: 1}}>
                  <Switch
                    label="Skjul fra 'profil' siden"
                    onChange={(event) => {
                      hideFromProfile.change(
                        event.currentTarget.checked.toString(),
                      );
                    }}
                  />
                  <Switch
                    label="Skjul fra 'køb flere' siden"
                    onChange={(event) => {
                      hideFromCombine.change(
                        event.currentTarget.checked.toString(),
                      );
                    }}
                  />
                </Stack>
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
                  <Text>Hvad har prisen været tidligere.</Text>
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
                <Stack gap="0" style={{flex: 1}}>
                  <Select
                    data={selectSchedules}
                    {...getSelectProps(fields.scheduleId)}
                    allowDeselect={false}
                    defaultValue={fields.scheduleId.initialValue}
                    data-testid="schedules-select"
                  />
                  <Text fz="xs" c="dimmed">
                    Kan ikke ændres senere!
                  </Text>
                </Stack>
              </Flex>
              <SubmitButton>Tilføj ny ydelse</SubmitButton>
            </FlexInnerForm>
          </Form>
        </FormProvider>
      </AccountContent>
    </>
  );
}

export const CATEGORIES_FRAGMENT = `#graphql
  fragment CategoryStorefront on Collection {
    id
    title
    children: metafield(key: "children", namespace: "booking") {
      references(first: 20) {
        nodes {
          ... on Collection {
            id
            title
            products(first: 30) {
              nodes {
                id
                title
                descriptionHtml
              }
            }
          }
        }
      }
    }
  }
` as const;

export const COLLECTION = `#graphql
  ${CATEGORIES_FRAGMENT}
  query CategoriesStorefront(
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    collection(handle: "alle-behandlinger") {
      ...CategoryStorefront
    }
  }
` as const;
