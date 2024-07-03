import {
  FormProvider,
  getFormProps,
  getInputProps,
  useForm,
} from '@conform-to/react';
import {
  Box,
  Container,
  Grid,
  Progress,
  Stack,
  Text,
  TextInput,
  Title,
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
import {MultiTags} from '~/components/form/MultiTags';
import {RadioGroup} from '~/components/form/RadioGroup';
import {CUSTOMER_DETAILS_QUERY} from '~/graphql/customer-account/CustomerDetailsQuery';
import {getBookingShopifyApi} from '~/lib/api/bookingShopifyApi';
import {type UserUsernameTakenResponsePayload} from '~/lib/api/model';
import {convertHTML} from '~/lib/convertHTML';
import {customerCreateBody} from '~/lib/zod/bookingShopifyApi';
import {ControlDetails} from './account.business';

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
  const {defaultValue} = useLoaderData<typeof loader>();

  const [form, {aboutMe, username, gender, speaks}] = useForm({
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

  return (
    <>
      <Box mt={rem(50)} mb={rem(100)}>
        <Progress value={50} />
        <Container size="md" p={{base: 'xs', sm: 'xl'}}>
          <FormProvider context={form.context}>
            <Form method="post" {...getFormProps(form)}>
              <Grid gutter="xl">
                <Grid.Col span={{base: 12}}>
                  <Stack mb="lg">
                    <div>
                      <Text c="dimmed" tt="uppercase" fz="sm">
                        Step 1
                      </Text>
                      <Title fw="600">{t('account:business.title')}</Title>
                    </div>
                    <Text>{t('account:business.description1')}</Text>
                  </Stack>

                  <Stack gap="lg">
                    <TextInput
                      size="md"
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
                      size="md"
                      field={speaks}
                      data={[
                        {label: t('global:danish'), value: 'danish'},
                        {label: t('global:english'), value: 'english'},
                        {label: t('global:arabic'), value: 'arabic'},
                      ]}
                      label={t('account:business.speaks_label')}
                      placeholder={t('account:business.speaks_placeholder')}
                      data-testid="speaks-input"
                      error={
                        speaks.errors && t('account:business.missing_fields')
                      }
                    />
                  </Stack>
                </Grid.Col>
                <ControlDetails>
                  <SubmitButton size="md">
                    {t('account:business.create_business')}
                  </SubmitButton>
                </ControlDetails>
              </Grid>
            </Form>
          </FormProvider>
        </Container>
      </Box>
    </>
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
