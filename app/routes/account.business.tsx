import {
  FormProvider,
  getFormProps,
  getInputProps,
  getTextareaProps,
  useForm,
} from '@conform-to/react';
import {Stack, Text, TextInput, Textarea, Tooltip, rem} from '@mantine/core';
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
import {type z} from 'zod';
import {AccountContent} from '~/components/account/AccountContent';
import {AccountTitle} from '~/components/account/AccountTitle';
import {MultiTags} from '~/components/form/MultiTags';
import {RadioGroup} from '~/components/form/RadioGroup';
import {getBookingShopifyApi} from '~/lib/api/bookingShopifyApi';
import {type UserUsernameTakenResponsePayload} from '~/lib/api/model';
import {redirectWithNotification} from '~/lib/show-notification';
import {customerCreateBody} from '~/lib/zod/bookingShopifyApi';
import {CUSTOMER_QUERY} from './($locale).account';

export const schema = customerCreateBody.omit({
  fullname: true,
  customerId: true,
  phone: true,
  email: true,
  aboutMe: true,
  specialties: true,
  social: true,
  yearsExperience: true,
});

export async function action({request, params, context}: ActionFunctionArgs) {
  const customerAccessToken = await context.session.get('customerAccessToken');

  if (!customerAccessToken) {
    return redirect('/account/login');
  }

  const formData = await request.formData();
  const submission = parseWithZod(formData, {schema});

  if (submission.status !== 'success') {
    return submission.reply();
  }

  try {
    const {customer} = await context.storefront.query(CUSTOMER_QUERY, {
      variables: {
        customerAccessToken: customerAccessToken.accessToken,
        country: context.storefront.i18n.country,
        language: context.storefront.i18n.language,
      },
      cache: context.storefront.CacheNone(),
    });

    if (!customer) {
      return redirect('/account/login');
    }
    await getBookingShopifyApi().customerCreate({
      ...submission.value,
      customerId: parseInt(parseGid(customer.id).id),
      phone: customer.phone || '',
      email: customer.email || '',
      fullname: `${customer.firstName} ${customer.lastName}`,
      aboutMe: '',
      yearsExperience: '1',
      social: {
        facebook: '',
        instagram: '',
        x: '',
        youtube: '',
      },
      specialties: [],
    });

    return redirectWithNotification(context, {
      redirectUrl: `/account/dashboard?business=true`,
      title: 'Business konto',
      message: 'Du er nu business konto',
      color: 'green',
    });
  } catch (error) {
    return submission.reply();
  }
}

export async function loader({context, params}: LoaderFunctionArgs) {
  const customerAccessToken = await context.session.get('customerAccessToken');

  if (!customerAccessToken) {
    return redirect('/account/login');
  }

  const {customer} = await context.storefront.query(CUSTOMER_QUERY, {
    variables: {
      customerAccessToken: customerAccessToken.accessToken,
      country: context.storefront.i18n.country,
      language: context.storefront.i18n.language,
    },
    cache: context.storefront.CacheNone(),
  });

  if (!customer) {
    return redirect('/account/login');
  }

  const {payload: userIsBusiness} =
    await getBookingShopifyApi().customerIsBusiness(parseGid(customer.id).id);

  if (userIsBusiness.isBusiness) {
    return redirect('/account/public');
  }

  if (!customer.firstName || !customer.lastName) {
    return redirect(
      `${params?.locale || ''}/account/profile?${
        !customer.firstName ? 'firstName=true&' : ''
      }${!customer.lastName ? 'lastName=true' : ''}`,
    );
  }

  const {payload: professionOptions} =
    await getBookingShopifyApi().metaProfessions();

  const username = convertToValidUrlPath(
    customer.firstName || '',
    customer.lastName || '',
  );

  const {payload: usernameTaken} =
    await getBookingShopifyApi().userUsernameTaken(username);

  return json({
    professionOptions,
    defaultValue: {
      username: !usernameTaken.usernameTaken
        ? username
        : convertToValidUrlPath(
            customer.firstName || '',
            customer.lastName || '',
            true,
          ),
      shortDescription: '',
      professions: [],
      speaks: [],
      yearsExperience: '1',
      gender: 'woman',
    } as z.infer<typeof schema>,
  });
}

export default function AccountBusiness() {
  const lastResult = useActionData<typeof action>();
  const {professionOptions, defaultValue} = useLoaderData<typeof loader>();

  const [form, {username, shortDescription, gender, speaks, professions}] =
    useForm({
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
      <AccountTitle heading="Register selvstændig" />

      <AccountContent>
        <Stack mb="xl">
          <Text>
            Du er i gang med at registrere dig som selvstændig skønhedsekspert,
            og vi er begejstrede for at have dig med på holdet. Ved at blive en
            del af BySisters, træder du ind i et fællesskab, hvor passion for
            skønhed og ekspertise mødes for at skabe unikke oplevelser for
            kunderne.{' '}
          </Text>
          <Text>
            For at fuldføre din registrering, bedes du udfylde de nødvendige
            oplysninger om dig selv. Vi ser frem til at se, hvordan du vil
            berige vores fællesskab med din ekspertise og passion for skønhed.
            Velkommen til bySisters – sammen skaber vi skønhed!
          </Text>
        </Stack>
        <FormProvider context={form.context}>
          <Form method="post" {...getFormProps(form)}>
            <Stack gap="md">
              <TextInput
                label="Vælge en profilnavn"
                {...getInputProps(username, {type: 'text'})}
                onChange={onChangeUsername}
                rightSection={
                  fetcher.data?.usernameTaken ? (
                    <Tooltip label="Profilnavn er optaget">
                      <IconExclamationCircle
                        style={{width: rem(20), height: rem(20)}}
                        color="var(--mantine-color-error)"
                        data-cy="username-error"
                      />
                    </Tooltip>
                  ) : (
                    <IconCheck
                      style={{width: rem(20), height: rem(20)}}
                      color="var(--mantine-color-green-filled)"
                      data-cy="username-success"
                    />
                  )
                }
                data-cy="username-input"
              />

              <RadioGroup
                label="Hvad er dit køn?"
                field={gender}
                data={[
                  {value: 'woman', label: 'Kvinde'},
                  {value: 'man', label: 'Mand'},
                ]}
                data-cy="gender-input"
              />

              <MultiTags
                field={professions}
                data={professionOptions}
                label="Professioner"
                placeholder="Vælg professioner"
                data-cy="professions-input"
              />

              <MultiTags
                field={speaks}
                data={[
                  {label: 'Dansk', value: 'danish'},
                  {label: 'Engelsk', value: 'english'},
                ]}
                label="Hvilken sprog taler du"
                placeholder="Vælge sprog"
                data-cy="speaks-input"
              />

              <Textarea
                label="Skriv kort beskrivelse om dig selv"
                {...getTextareaProps(shortDescription)}
                error={shortDescription.errors && 'Udfyld venligst'}
                minRows={10}
                data-cy="short-description-input"
              />

              <div>
                <SubmitButton>Opret en business konto</SubmitButton>
              </div>
            </Stack>
          </Form>
        </FormProvider>
      </AccountContent>
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
