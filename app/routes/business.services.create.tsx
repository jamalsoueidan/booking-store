import {
  FormProvider,
  getFormProps,
  getInputProps,
  getSelectProps,
  useForm,
  useInputControl,
} from '@conform-to/react';
import {parseWithZod} from '@conform-to/zod';

import {
  ActionIcon,
  Container,
  Divider,
  Flex,
  Indicator,
  Loader,
  rem,
  Select,
  Stack,
  Switch,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import {Form, useActionData, useFetcher, useLoaderData} from '@remix-run/react';
import {redirect} from '@remix-run/server-runtime';
import {
  json,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
} from '@shopify/remix-oxygen';

import {useCallback, useEffect, useState} from 'react';
import {SubmitButton} from '~/components/form/SubmitButton';
import {SwitchGroupLocations} from '~/components/form/SwitchGroupLocations';

import {getBookingShopifyApi} from '~/lib/api/bookingShopifyApi';

import {IconAirBalloon} from '@tabler/icons-react';
import {redirectWithSuccess} from 'remix-toast';
import {AccountContent} from '~/components/account/AccountContent';
import {AccountTitle} from '~/components/account/AccountTitle';
import {AmountInput} from '~/components/form/AmountInput';
import {TextEditor} from '~/components/richtext/TextEditor';
import {FlexInnerForm} from '~/components/tiny/FlexInnerForm';
import {
  type CustomerProductLocationsItem,
  type OpenAIProductTitle200Payload,
} from '~/lib/api/model';
import {baseURL} from '~/lib/api/mutator/query-client';
import {convertHTML} from '~/lib/convertHTML';
import {getCustomer} from '~/lib/get-customer';
import {customerProductAddBody} from '~/lib/zod/bookingShopifyApi';
import {GET_CATEGORY_QUERY} from './categories_.$handle';

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

    return redirectWithSuccess(`/business/services/${product.productId}`, {
      message: 'Ydelsen er nu oprettet!',
    });
  } catch (error) {
    return submission.reply();
  }
};

export async function loader({context}: LoaderFunctionArgs) {
  const customerId = await getCustomer({context});

  const {collection: rootCollection} = await context.storefront.query(
    GET_CATEGORY_QUERY,
    {
      variables: {
        handle: 'alle-behandlinger',
      },
      cache: context.storefront.CacheShort(),
    },
  );

  const {payload: schedules} =
    await getBookingShopifyApi().customerScheduleList(customerId, context);

  const {payload: locations} =
    await getBookingShopifyApi().customerLocationList(customerId, context);

  if (locations.length === 0 || schedules.length === 0) {
    return redirect('/business/services');
  }

  return json({
    locations,
    schedules,
    rootCollection,
    defaultValue: {
      title: '',
      productType: '',
      description: null,
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
      locations: [] as CustomerProductLocationsItem[],
    },
  });
}

export default function AccountServicesCreate() {
  const {locations, defaultValue, schedules, rootCollection} =
    useLoaderData<typeof loader>();
  const lastResult = useActionData<typeof action>();
  const [descriptionHtml, setDescriptionHtml] = useState<string | null>(null);
  const fetcher = useFetcher<OpenAIProductTitle200Payload>();

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
  const descriptionInput = useInputControl(fields.description);

  const aiSuggestion = useCallback(() => {
    fetcher.submit(
      {title: fields.title.value || ''},
      {action: '/business/api/ai-suggestion'},
    );
  }, [fetcher, fields.title.value]);

  useEffect(() => {
    if (fetcher.data && fetcher.state === 'idle') {
      form.update({name: fields.title.name, value: fetcher.data.title});
      form.update({
        name: fields.productType.name,
        value: fetcher.data.collection?.title || '',
      });
      setDescriptionHtml(fetcher.data.description);
      fetcher.load('/business/api/ai-suggestion'); //reset
    }
  }, [
    fetcher,
    fetcher.data,
    fetcher.state,
    fields.productType.name,
    fields.title.name,
    fields.title.value,
    form,
  ]);

  return (
    <Container size="md" my={{base: rem(80), sm: rem(100)}}>
      <AccountTitle linkBack="/business/services" heading="Opret en ydelse" />
      <AccountContent>
        <FormProvider context={form.context}>
          <Form method="post" {...getFormProps(form)}>
            <FlexInnerForm>
              <Title order={3}>Title & Beskrivelse</Title>

              <Flex direction={{base: 'column', md: 'row'}} gap="md">
                <Stack gap="0" style={{flex: 1}}>
                  <Text fw="bold">Title:</Text>
                  <Text>Title på ydelsen</Text>
                </Stack>
                <TextInput
                  {...getInputProps(fields.title, {type: 'text'})}
                  style={{flex: 1}}
                  rightSection={
                    <Indicator inline label="AI" size={16}>
                      <ActionIcon
                        color="dark"
                        disabled={!fields.title.value}
                        onClick={aiSuggestion}
                      >
                        {fetcher.state !== 'idle' ? (
                          <Loader color="white" size={rem(16)} />
                        ) : (
                          <IconAirBalloon
                            style={{width: rem(16), height: rem(16)}}
                          />
                        )}
                      </ActionIcon>
                    </Indicator>
                  }
                />
              </Flex>

              <Flex direction={{base: 'column', md: 'row'}} gap="md">
                <Stack gap="0" style={{flex: 1}}>
                  <Text fw="bold">Kategori:</Text>
                  <Text>Kategori på ydelsen</Text>
                </Stack>
                <div style={{flex: 1}}>
                  <Select
                    {...getSelectProps(fields.productType)}
                    defaultValue={fields.productType.initialValue}
                    placeholder="Vælg en kategori"
                    data={rootCollection?.children?.references?.nodes.map(
                      (collection) => ({
                        value: collection.title,
                        label: collection.title,
                      }),
                    )}
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
                    content={descriptionHtml}
                    onUpdate={({editor}) => {
                      descriptionInput.change(JSON.stringify(editor.getJSON()));
                    }}
                    onSelectionUpdate={({editor}) => {
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
                  <AmountInput
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
                  <AmountInput
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
    </Container>
  );
}
