import {conform, useForm} from '@conform-to/react';
import {parse} from '@conform-to/zod';
import {
  Blockquote,
  Group,
  Radio,
  Stack,
  TextInput,
  Textarea,
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

import {IconCheck, IconExclamationCircle} from '@tabler/icons-react';
import {type z} from 'zod';
import {AccountContent} from '~/components/account/AccountContent';
import {AccountTitle} from '~/components/account/AccountTitle';
import {MultiTags} from '~/components/form/MultiTags';
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
  const submission = parse(formData, {schema});

  if (submission.intent !== 'submit' || !submission.value) {
    return json(submission);
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
      redirectUrl: `/account`,
      title: 'Business konto',
      message: 'Du er nu business konto',
      color: 'green',
    });
  } catch (error) {
    return json(submission);
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
  const lastSubmission = useActionData<typeof action>();
  const {professionOptions, defaultValue} = useLoaderData<typeof loader>();

  const [form, {username, shortDescription, gender, speaks, professions}] =
    useForm({
      lastSubmission,
      defaultValue,
      onValidate({formData}) {
        return parse(formData, {
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
        <Blockquote color="lime" my="md">
          Du er i gang med at registrere dig som selvstændig skønhedsekspert, og
          vi er begejstrede for at have dig med på holdet. Ved at blive en del
          af bySisters, træder du ind i et fællesskab, hvor passion for skønhed
          og ekspertise mødes for at skabe unikke oplevelser for kunderne.{' '}
          <br />
          For at fuldføre din registrering, bedes du udfylde de nødvendige
          oplysninger om dig selv og de ydelser, du tilbyder. Dette vil gøre det
          muligt for potentielle kunder at finde og booke dig gennem
          bySisters.dk. Vi ser frem til at se, hvordan du vil berige vores
          fællesskab med din ekspertise og passion for skønhed. Velkommen til
          bySisters – sammen skaber vi skønhed!
        </Blockquote>

        <Form method="post" {...form.props}>
          <Stack gap="md">
            <TextInput
              label="Vælge en profilnavn"
              {...conform.input(username)}
              onChange={onChangeUsername}
              rightSection={
                fetcher.data?.usernameTaken ? (
                  <IconExclamationCircle
                    style={{width: rem(20), height: rem(20)}}
                    color="var(--mantine-color-error)"
                  />
                ) : (
                  <IconCheck
                    style={{width: rem(20), height: rem(20)}}
                    color="var(--mantine-color-green-filled)"
                  />
                )
              }
            />

            <Radio.Group
              label="Hvad er dit køn?"
              withAsterisk
              {...conform.input(gender)}
            >
              <Group mt="xs">
                <Radio value="woman" label="Kvinde" />
                <Radio value="man" label="Mand" />
              </Group>
            </Radio.Group>

            <MultiTags
              field={professions}
              data={professionOptions}
              name="professions"
              label="Professioner"
              placeholder="Vælg professioner"
            />

            <MultiTags
              field={speaks}
              data={[
                {label: 'Dansk', value: 'danish'},
                {label: 'Engelsk', value: 'english'},
              ]}
              name="speaks"
              label="Hvilken sprog taler du"
              placeholder="Vælge sprog"
            />

            <Textarea
              label="Skriv kort beskrivelse om dig selv"
              {...conform.input(shortDescription)}
              error={shortDescription.error && 'Udfyld venligst'}
              minRows={10}
            />

            <div>
              <SubmitButton>Opret en business konto</SubmitButton>
            </div>
          </Stack>
        </Form>
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
