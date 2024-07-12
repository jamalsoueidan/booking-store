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
import {
  json,
  redirect,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
} from '@shopify/remix-oxygen';
import {IconAirBalloon} from '@tabler/icons-react';
import {useCallback, useEffect, useState} from 'react';
import {AmountInput} from '~/components/form/AmountInput';
import {SubmitButton} from '~/components/form/SubmitButton';
import {SwitchGroupLocations} from '~/components/form/SwitchGroupLocations';
import {TextEditor} from '~/components/richtext/TextEditor';
import {FlexInnerForm} from '~/components/tiny/FlexInnerForm';
import {getBookingShopifyApi} from '~/lib/api/bookingShopifyApi';
import {type OpenAIProductTitle200Payload} from '~/lib/api/model';
import {baseURL} from '~/lib/api/mutator/query-client';
import {convertHTML} from '~/lib/convertHTML';
import {getCustomer} from '~/lib/get-customer';
import {customerProductUpdateBody} from '~/lib/zod/bookingShopifyApi';
import {GET_CATEGORY_QUERY} from './categories_.$handle';

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
    await getBookingShopifyApi().customerProductUpdate(customerId, productId, {
      ...submission.value,
      descriptionHtml: convertHTML(submission.value.description),
    });

    await context.storefront.cache?.delete(
      `${baseURL}/customer/${customerId}/products`,
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

  const {collection: rootCollection} = await context.storefront.query(
    GET_CATEGORY_QUERY,
    {
      variables: {
        handle: 'alle-behandlinger',
      },
      cache: context.storefront.CacheShort(),
    },
  );

  const {productId} = params;
  if (!productId) {
    throw new Error('Missing productId param');
  }

  const locations = await getBookingShopifyApi().customerLocationList(
    customerId,
    context,
  );

  const {payload: defaultValue} =
    await getBookingShopifyApi().customerProductGet(
      customerId,
      productId,
      context,
    );

  return json({
    rootCollection,
    defaultValue: {
      ...defaultValue,
      hideFromCombine: defaultValue.hideFromCombine.toString(),
      hideFromProfile: defaultValue.hideFromProfile.toString(),
    },
    locations: locations.payload,
  });
}

export default function EditAddress() {
  const {locations, defaultValue, rootCollection} =
    useLoaderData<typeof loader>();
  const lastResult = useActionData<typeof action>();
  const [descriptionHtml, setDescriptionHtml] = useState<string | null>(
    defaultValue.descriptionHtml
      ? (JSON.parse(defaultValue.description) as any)
      : '',
  );
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
      fetcher.load('/business/api/ai-suggestion');
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
              <Text>Skjul fra evt. profil siden eller kombinere siden?</Text>
            </Stack>
            <Stack style={{flex: 1}}>
              <Switch
                label="Skjul fra 'profil' siden"
                defaultChecked={fields.hideFromProfile.initialValue === 'true'}
                onChange={(event) => {
                  hideFromProfile.change(
                    event.currentTarget.checked.toString(),
                  );
                }}
              />
              <Switch
                label="Skjul fra 'køb flere' siden"
                defaultChecked={fields.hideFromCombine.initialValue === 'true'}
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
              <Text>Hvad har prisen været tidligere?</Text>
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

          <SubmitButton>Gem ændringer</SubmitButton>
        </FlexInnerForm>
      </Form>
    </FormProvider>
  );
}
