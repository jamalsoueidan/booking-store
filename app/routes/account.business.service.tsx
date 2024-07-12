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
  Flex,
  Loader,
  Progress,
  rem,
  Select,
  Stack,
  Text,
  TextInput,
  Title,
  Tooltip,
} from '@mantine/core';
import {Form, useActionData, useFetcher, useLoaderData} from '@remix-run/react';
import {
  json,
  redirect,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
} from '@shopify/remix-oxygen';

import {useCallback, useEffect, useState} from 'react';
import {SubmitButton} from '~/components/form/SubmitButton';

import {getBookingShopifyApi} from '~/lib/api/bookingShopifyApi';

import {IconAi} from '@tabler/icons-react';
import {useTranslation} from 'react-i18next';
import {AmountInput} from '~/components/form/AmountInput';
import {TextEditor} from '~/components/richtext/TextEditor';
import {CUSTOMER_DETAILS_QUERY} from '~/graphql/customer-account/CustomerDetailsQuery';
import {type OpenAIProductTitle200Payload} from '~/lib/api/model';
import {convertHTML} from '~/lib/convertHTML';
import {getCustomer} from '~/lib/get-customer';
import {updateCustomerTag} from '~/lib/updateTag';
import {customerProductAddBody} from '~/lib/zod/bookingShopifyApi';
import {BottomSection, WrapSection} from './account.business';
import {GET_CATEGORY_QUERY} from './categories_.$handle';

const schema = customerProductAddBody.omit({
  descriptionHtml: true,
  scheduleId: true,
  locations: true,
  hideFromCombine: true,
  hideFromProfile: true,
});

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
    const {payload: schedules} =
      await getBookingShopifyApi().customerScheduleList(customerId);

    const {payload: locations} =
      await getBookingShopifyApi().customerLocationList(customerId);

    await getBookingShopifyApi().customerProductAdd(customerId, {
      ...submission.value,
      descriptionHtml: convertHTML(submission.value.description || ''),
      locations: [
        {
          location: locations[0]._id,
          locationType: locations[0].locationType,
        },
      ],
      scheduleId: schedules[0]._id,
      hideFromCombine: 'false',
      hideFromProfile: 'false',
    });

    await updateCustomerTag({
      env: context.env,
      customerId,
      tags: 'business-step1, business-step2, business-step3, business-step4',
    });

    return redirect(`/account/business/profile`);
  } catch (error) {
    return submission.reply();
  }
};

export async function loader({context}: LoaderFunctionArgs) {
  const {collection: rootCollection} = await context.storefront.query(
    GET_CATEGORY_QUERY,
    {
      variables: {
        handle: 'alle-behandlinger',
      },
      cache: context.storefront.CacheShort(),
    },
  );

  const {data} = await context.customerAccount.query(CUSTOMER_DETAILS_QUERY);

  if (data.customer.tags.includes('business-step4')) {
    return redirect('/account/business/profile');
  }

  return json({
    rootCollection,
    defaultValue: {
      title: '',
      productType: '',
      description: null,
      compareAtPrice: {
        amount: '0',
        currencyCode: 'DKK',
      },
      price: {
        amount: '0',
        currencyCode: 'DKK',
      },
    },
  });
}

export default function AccountServicesCreate() {
  const {t} = useTranslation(['account', 'global', 'zod']);
  const {defaultValue, rootCollection} = useLoaderData<typeof loader>();
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

  const descriptionInput = useInputControl(fields.description);

  const aiSuggestion = useCallback(() => {
    fetcher.submit(
      {title: fields.title.value || ''},
      {action: '/business/api/ai/product'},
    );
  }, [fetcher, fields.title.value]);

  useEffect(() => {
    if (fetcher.data && fetcher.state === 'idle') {
      form.update({name: fields.title.name, value: fetcher.data.title});
      form.update({
        name: fields.productType.name,
        value: fetcher.data.collection?.title || '',
      });
      form.update({
        name: fields.price.name,
        value: {
          amount: fetcher.data.price,
          currencyCode: 'DKK',
        },
      });
      setDescriptionHtml(fetcher.data.description);
      fetcher.load('/api/reset'); //reset
    }
  }, [
    fetcher,
    fetcher.data,
    fetcher.state,
    fields.price.name,
    fields.productType.name,
    fields.title.name,
    fields.title.value,
    form,
  ]);

  return (
    <WrapSection>
      <Progress value={80} size="sm" />
      <FormProvider context={form.context}>
        <Form method="POST" {...getFormProps(form)}>
          <Container size="md" py={{base: 'sm', md: rem(60)}}>
            <Stack mb="lg">
              <div>
                <Text c="dimmed" tt="uppercase" fz="sm">
                  {t('account:business.step', {step: 4})}
                </Text>
                <Title fw="600" fz={{base: 'h2', sm: undefined}}>
                  {t('account:business.service.title')}
                </Title>
              </div>
            </Stack>

            <Stack>
              <TextInput
                {...getInputProps(fields.title, {type: 'text'})}
                style={{flex: 1}}
                label="Title på ydelsen"
                rightSection={
                  <ActionIcon
                    color="dark"
                    disabled={
                      !(
                        fields.title.valid &&
                        fields.title.value &&
                        fields.title.value.length > 5
                      )
                    }
                    onClick={aiSuggestion}
                  >
                    {fetcher.state !== 'idle' ? (
                      <Loader color="white" size={rem(16)} />
                    ) : (
                      <Tooltip
                        label="Klik her for at bruge AI til at udfylde resten af felterne automatisk. Sørg for at afslutte indtastningen af titlen først."
                        offset={{mainAxis: 16, crossAxis: 0}}
                        arrowSize={10}
                        multiline
                        w={220}
                        withArrow
                        opened={
                          fields.title.valid &&
                          fields.title.value &&
                          fields.title.value.length > 5
                            ? true
                            : false
                        }
                        position="top"
                      >
                        <IconAi />
                      </Tooltip>
                    )}
                  </ActionIcon>
                }
              />

              <Select
                label="Kategori på ydelsen"
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

              <Stack gap="0">
                <Text>Beskrive af ydelse</Text>
                <TextEditor
                  content={descriptionHtml}
                  onUpdate={({editor}) => {
                    descriptionInput.change(JSON.stringify(editor.getJSON()));
                  }}
                  onSelectionUpdate={({editor}) => {
                    descriptionInput.change(JSON.stringify(editor.getJSON()));
                  }}
                />
              </Stack>

              <Flex gap="md">
                <Stack gap="0" style={{flex: 1}}>
                  <Text fw="bold">Pris:</Text>
                  <Text>Den pris, kunden skal betale.</Text>
                </Stack>
                <Flex justify="flex-end" align="flex-end">
                  <AmountInput
                    field={fields.price}
                    required
                    hideControls={true}
                    data-testid="price-input"
                    rightSection="DKK"
                    rightSectionWidth={50}
                    style={{width: '100px'}}
                  />
                </Flex>
              </Flex>
              <Flex gap="md">
                <Stack gap="0" style={{flex: 1}}>
                  <Text fw="bold">Før-pris:</Text>
                  <Text>Hvad har prisen været tidligere.</Text>
                </Stack>
                <Flex justify="flex-end" align="flex-end">
                  <AmountInput
                    field={fields.compareAtPrice}
                    hideControls={true}
                    rightSection="DKK"
                    rightSectionWidth={50}
                    data-testid="compare-at-price-input"
                    style={{width: '100px'}}
                  />
                </Flex>
              </Flex>
            </Stack>
          </Container>
          <BottomSection>
            <SubmitButton size="md" disabled={!form.valid}>
              {t('account:business.schedule.submit')}
            </SubmitButton>
          </BottomSection>
        </Form>
      </FormProvider>
    </WrapSection>
  );
}
