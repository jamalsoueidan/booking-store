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
import {Form, useActionData} from '@remix-run/react';
import {parseGid} from '@shopify/hydrogen';
import {type ActionFunctionArgs} from '@shopify/remix-oxygen';
import {SubmitButton} from '~/components/form/SubmitButton';

import {conformZodMessage, parseWithZod} from '@conform-to/zod';
import {IconAt, IconCheck, IconExclamationCircle} from '@tabler/icons-react';
import {useMemo} from 'react';
import {useTranslation} from 'react-i18next';
import {redirectWithSuccess} from 'remix-toast';
import {z} from 'zod';
import {makeZodI18nMap} from 'zod-i18n-map';
import {MultiTags} from '~/components/form/MultiTags';
import {RadioGroup} from '~/components/form/RadioGroup';
import {CUSTOMER_DETAILS_QUERY} from '~/graphql/customer-account/CustomerDetailsQuery';
import {getBookingShopifyApi} from '~/lib/api/bookingShopifyApi';
import {type UserUsernameTakenResponsePayload} from '~/lib/api/model';
import {customerCreateBody} from '~/lib/zod/bookingShopifyApi';
import {ControlDetails} from './account.business';

const isUsernameUnique =
  ({request}: ActionFunctionArgs) =>
  async (username: string) => {
    const url = new URL(request.url);
    const response = await fetch(
      `${url.origin}/api/check-username?username=${username}`,
    );
    const data: UserUsernameTakenResponsePayload =
      (await response.json()) as any;
    return data.usernameTaken;
  };

function createSchema(options?: {
  isUsernameUnique: (username: string) => Promise<boolean>;
}) {
  return customerCreateBody
    .omit({
      fullname: true,
      customerId: true,
    })
    .extend({
      username: customerCreateBody.shape.username.pipe(
        // Note: The callback cannot be async here
        // As we run zod validation synchronously on the client
        z.string().superRefine((username, ctx) => {
          if (typeof options?.isUsernameUnique !== 'function') {
            ctx.addIssue({
              code: 'custom',
              message: conformZodMessage.VALIDATION_UNDEFINED,
              fatal: true,
            });
            return;
          }

          return options.isUsernameUnique(username).then((usernameIsTaken) => {
            if (usernameIsTaken) {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                params: {
                  i18n: 'username.username_taken',
                },
              });
            }
          });
        }),
      ),
    });
}

export async function action({request, params, context}: ActionFunctionArgs) {
  await context.customerAccount.handleAuthStatus();

  const formData = await request.formData();
  const submission = await parseWithZod(formData, {
    schema: createSchema({
      isUsernameUnique: isUsernameUnique({request, params, context}),
    }),
    async: true,
  });

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
            tags: 'business-step1',
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

export default function AccountBusiness() {
  const {t} = useTranslation(['account', 'global', 'zod']);
  z.setErrorMap(makeZodI18nMap());
  const lastResult = useActionData<typeof action>();

  const [form, {username, gender, speaks}] = useForm({
    lastResult,
    defaultValue: {
      username: '',
      speaks: ['danish'],
      gender: 'woman',
    },
    onValidate({formData}) {
      return parseWithZod(formData, {
        schema: createSchema(),
      });
    },
    shouldValidate: 'onBlur',
  });

  const iconMarkup = useMemo(() => {
    if (username.errors) {
      return (
        <Tooltip label="Profilnavn er optaget">
          <IconExclamationCircle
            style={{width: rem(20), height: rem(20)}}
            color="var(--mantine-color-error)"
            data-testid="username-error"
          />
        </Tooltip>
      );
    } else {
      return (
        <IconCheck
          style={{width: rem(20), height: rem(20)}}
          color="var(--mantine-color-green-filled)"
          data-testid="username-success"
        />
      );
    }
  }, [username.errors]);

  return (
    <>
      <Box mt={rem(60)} mb={rem(100)}>
        <Progress value={20} size="sm" />
        <Container
          size="md"
          p={{base: 'md', sm: 'xl'}}
          pt={{base: 'md', sm: rem(80)}}
        >
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
                      leftSection={<IconAt size={16} />}
                      label={t('account:business.nickname')}
                      pattern="[a-zA-Z0-9\\-_]*"
                      {...getInputProps(username, {type: 'text'})}
                      error={username.errors && username.errors[0]}
                      rightSection={iconMarkup}
                      required
                      data-testid="username-input"
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

                    <RadioGroup
                      label={t('account:business.gender')}
                      field={gender}
                      data={[
                        {label: t('global:woman'), value: 'woman'},
                        {label: t('global:man'), value: 'man'},
                      ]}
                      data-testid="gender-input"
                    />
                  </Stack>
                </Grid.Col>
                <ControlDetails>
                  <SubmitButton size="md" disabled={!form.valid}>
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
