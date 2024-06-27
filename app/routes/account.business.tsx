import {
  FormProvider,
  getFormProps,
  getInputProps,
  getTextareaProps,
  useForm,
  useInputControl,
} from '@conform-to/react';
import {
  Container,
  Stack,
  Text,
  TextInput,
  Textarea,
  Tooltip,
  rem,
} from '@mantine/core';
import {Form, useActionData, useFetcher, useLoaderData} from '@remix-run/react';
import {parseGid} from '@shopify/hydrogen';
import {
  json,
  redirect,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
} from '@shopify/remix-oxygen';
import {SubmitButton} from '~/components/form/SubmitButton';

import {parseWithZod} from '@conform-to/zod';
import {IconCheck, IconExclamationCircle} from '@tabler/icons-react';
import {useTranslation} from 'react-i18next';
import {redirectWithSuccess} from 'remix-toast';
import {type z} from 'zod';
import {AccountContent} from '~/components/account/AccountContent';
import {AccountTitle} from '~/components/account/AccountTitle';
import {MultiTags} from '~/components/form/MultiTags';
import {RadioGroup} from '~/components/form/RadioGroup';
import {TextEditor} from '~/components/richtext/TextEditor';
import {CUSTOMER_DETAILS_QUERY} from '~/graphql/customer-account/CustomerDetailsQuery';
import {getBookingShopifyApi} from '~/lib/api/bookingShopifyApi';
import {type UserUsernameTakenResponsePayload} from '~/lib/api/model';
import {convertHTML} from '~/lib/convertHTML';
import {customerCreateBody} from '~/lib/zod/bookingShopifyApi';

export const schema = customerCreateBody.omit({
  fullname: true,
  customerId: true,
  aboutMeHtml: true,
});

export async function action({request, context}: ActionFunctionArgs) {
  await context.customerAccount.handleAuthStatus();

  const formData = await request.formData();
  const submission = parseWithZod(formData, {schema});

  if (submission.status !== 'success') {
    return submission.reply();
  }

  try {
    const {data, errors} = await context.customerAccount.query(
      CUSTOMER_DETAILS_QUERY,
    );

    if (errors?.length || !data?.customer) {
      throw new Error('Customer not found');
    }

    await getBookingShopifyApi().customerCreate({
      ...submission.value,
      customerId: parseInt(parseGid(data.customer.id).id),
      fullname: `${data.customer.firstName} ${data.customer.lastName}`,
      aboutMeHtml: convertHTML(submission.value.aboutMe),
    });

    await fetch(
      `https://${context.env.PUBLIC_STORE_DOMAIN}/admin/api/2024-01/customers/${
        parseGid(data.customer.id).id
      }.json`,
      {
        method: 'PUT',
        headers: {
          'X-Shopify-Access-Token': context.env.PRIVATE_API_ACCESS_TOKEN,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customer: {
            id: data.customer.id,
            tags: 'business',
          },
        }),
      },
    );

    return redirectWithSuccess('/business', {
      message: 'Du er nu opgraderet til business konto!',
    });
  } catch (error) {
    return submission.reply();
  }
}

export async function loader({context, params}: LoaderFunctionArgs) {
  await context.customerAccount.handleAuthStatus();

  const {data, errors} = await context.customerAccount.query(
    CUSTOMER_DETAILS_QUERY,
  );

  if (errors?.length || !data?.customer) {
    throw new Error('Customer not found');
  }

  if (data.customer.tags.includes('business')) {
    return redirect('/business');
  }

  const {payload: professionOptions} =
    await getBookingShopifyApi().metaProfessions();

  const username = convertToValidUrlPath(
    data.customer.firstName || '',
    data.customer.lastName || '',
  );

  const {payload: usernameTaken} =
    await getBookingShopifyApi().userUsernameTaken(username);

  return json({
    professionOptions,
    defaultValue: {
      username: !usernameTaken.usernameTaken
        ? username
        : convertToValidUrlPath(
            data.customer.firstName || '',
            data.customer.lastName || '',
            true,
          ),
      shortDescription: '',
      professions: [],
      speaks: ['danish'],
      yearsExperience: '1',
      gender: 'woman',
      aboutMe: '',
    } as z.infer<typeof schema>,
  });
}

export default function AccountBusiness() {
  const {t} = useTranslation(['account', 'global']);
  const lastResult = useActionData<typeof action>();
  const {professionOptions, defaultValue} = useLoaderData<typeof loader>();

  const [
    form,
    {aboutMe, username, shortDescription, gender, speaks, professions},
  ] = useForm({
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

  const fetcher = useFetcher<UserUsernameTakenResponsePayload>();

  const onChangeUsername = (event: React.ChangeEvent<HTMLInputElement>) => {
    fetcher.load(`/api/usernameTaken?username=${event.target.value}`);
  };

  const control = useInputControl(aboutMe);

  return (
    <Container size="md" my={{base: rem(80), sm: rem(100)}}>
      <AccountTitle
        linkBack="/account/dashboard"
        heading={t('account:business.title')}
      />

      <AccountContent>
        <Stack mb="xl">
          <Text>{t('account:business.description1')}</Text>
          <Text>{t('account:business.description2')}</Text>
        </Stack>
        <FormProvider context={form.context}>
          <Form method="post" {...getFormProps(form)}>
            <Stack gap="xl">
              <TextInput
                size="lg"
                label={t('account:business.nickname')}
                {...getInputProps(username, {type: 'text'})}
                onChange={onChangeUsername}
                rightSection={
                  fetcher.data?.usernameTaken ? (
                    <Tooltip label="Profilnavn er optaget">
                      <IconExclamationCircle
                        style={{width: rem(20), height: rem(20)}}
                        color="var(--mantine-color-error)"
                        data-testid="username-error"
                      />
                    </Tooltip>
                  ) : (
                    <IconCheck
                      style={{width: rem(20), height: rem(20)}}
                      color="var(--mantine-color-green-filled)"
                      data-testid="username-success"
                    />
                  )
                }
                data-testid="username-input"
              />

              <RadioGroup
                label={t('account:business.gender')}
                field={gender}
                data={[
                  {label: t('global:woman'), value: 'woman'},
                  {label: t('global:man'), value: 'man'},
                ]}
                data-testid="gender-input"
              />

              <MultiTags
                size="lg"
                field={professions}
                data={professionOptions}
                label={t('account:business.profession_label')}
                placeholder={t('account:business.profession_placeholder')}
                data-testid="professions-input"
                error={
                  professions.errors && t('account:business.missing_fields')
                }
              />

              <MultiTags
                size="lg"
                field={speaks}
                data={[
                  {label: t('global:danish'), value: 'danish'},
                  {label: t('global:english'), value: 'english'},
                  {label: t('global:arabic'), value: 'arabic'},
                ]}
                label={t('account:business.speaks_label')}
                placeholder={t('account:business.speaks_placeholder')}
                data-testid="speaks-input"
                error={speaks.errors && t('account:business.missing_fields')}
              />

              <Textarea
                label={t('account:business.short_description')}
                {...getTextareaProps(shortDescription)}
                error={
                  shortDescription.errors &&
                  t('account:business.missing_fields')
                }
                mih="100px"
                size="lg"
                data-testid="short-description-input"
              />

              <div>
                <Text size="lg" mb={rem(2)} fw={500}>
                  {t('account:business.aboutme_label')}
                </Text>

                <TextEditor
                  onUpdate={({editor}) => {
                    control.change(JSON.stringify(editor.getJSON()) as any);
                  }}
                />
              </div>

              <div>
                <SubmitButton size="lg">
                  {t('account:business.create_business')}
                </SubmitButton>
              </div>
            </Stack>
          </Form>
        </FormProvider>
      </AccountContent>
    </Container>
  );
}

function convertToValidUrlPath(
  firstName: string,
  lastName: string,
  random?: boolean,
): string {
  const allowedCharactersRegex = /[^a-zA-Z0-9\-_]/g;
  firstName = firstName.replace(allowedCharactersRegex, '');
  lastName = lastName.replace(allowedCharactersRegex, '');
  const urlPath = `${firstName}-${lastName}${random ? '-96' : ''}`;
  return urlPath?.toLowerCase();
}
