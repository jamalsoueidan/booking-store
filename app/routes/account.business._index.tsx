import {
  FormProvider,
  getFormProps,
  getInputProps,
  useForm,
} from '@conform-to/react';
import {
  Container,
  Flex,
  Progress,
  rem,
  Stack,
  Text,
  TextInput,
  Title,
  Tooltip,
} from '@mantine/core';
import {Form, useActionData} from '@remix-run/react';
import {parseGid} from '@shopify/hydrogen';
import {
  json,
  redirect,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
} from '@shopify/remix-oxygen';
import {SubmitButton} from '~/components/form/SubmitButton';

import {conformZodMessage, parseWithZod} from '@conform-to/zod';
import {IconAt, IconCheck, IconExclamationCircle} from '@tabler/icons-react';
import {useMemo} from 'react';
import {useTranslation} from 'react-i18next';
import {z} from 'zod';
import {MultiTags} from '~/components/form/MultiTags';
import {RadioGroup} from '~/components/form/RadioGroup';
import {CUSTOMER_DETAILS_QUERY} from '~/graphql/customer-account/CustomerDetailsQuery';
import {getBookingShopifyApi} from '~/lib/api/bookingShopifyApi';
import {customerCreateBody} from '~/lib/zod/bookingShopifyApi';
import {isUsernameUnique} from './api.check-username';

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

    return redirect('/account/business/location');
  } catch (error) {
    return submission.reply();
  }
}

export async function loader({context}: LoaderFunctionArgs) {
  await context.customerAccount.handleAuthStatus();

  const {data} = await context.customerAccount.query(CUSTOMER_DETAILS_QUERY);

  if (data.customer.tags.includes('business-step1')) {
    return redirect('/account/business/location');
  }

  return json(null);
}

export default function AccountBusiness() {
  const {t} = useTranslation(['account', 'global', 'zod']);
  const lastResult = useActionData<typeof action>();

  const [form, {username, gender, speaks}] = useForm({
    lastResult,
    defaultValue: {
      username: undefined,
      speaks: ['danish'],
      gender: 'woman',
    },
    onValidate({formData}) {
      return parseWithZod(formData, {
        schema: createSchema(),
      });
    },
    shouldValidate: 'onBlur',
    shouldRevalidate: 'onInput',
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
    }
    if (username.value && !username.errors) {
      return (
        <IconCheck
          style={{width: rem(20), height: rem(20)}}
          color="var(--mantine-color-green-filled)"
          data-testid="username-success"
        />
      );
    }
  }, [username.errors, username.value]);

  return (
    <>
      <Progress value={20} size="sm" />
      <FormProvider context={form.context}>
        <Form
          method="post"
          {...getFormProps(form)}
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Container size="md" flex="1" p={{base: 'md', sm: rem(70)}}>
            <Stack mb="lg">
              <div>
                <Text c="dimmed" tt="uppercase" fz="sm">
                  {t('account:business.step', {step: 1})}
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
                error={speaks.errors && t('account:business.missing_fields')}
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
          </Container>
          <Flex
            justify="flex-end"
            align="center"
            pos="sticky"
            bottom="0"
            p="md"
            style={{boxShadow: '0 -2px 10px rgba(0, 0, 0, 0.1)'}}
          >
            <SubmitButton size="md" disabled={!form.valid}>
              {t('account:business.create_business')}
            </SubmitButton>
          </Flex>
        </Form>
      </FormProvider>
    </>
  );
}
