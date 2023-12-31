import {conform, useFieldset, useForm} from '@conform-to/react';
import {parse} from '@conform-to/zod';
import {
  Group,
  Radio,
  Stack,
  Text,
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

import {IconAt, IconCheck, IconExclamationCircle} from '@tabler/icons-react';
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

  const {payload: specialityOptions} =
    await getBookingShopifyApi().metaspecialties();

  const username = convertToValidUrlPath(
    customer.firstName || '',
    customer.lastName || '',
  );

  const {payload: usernameTaken} =
    await getBookingShopifyApi().userUsernameTaken(username);

  return json({
    professionOptions,
    specialityOptions,
    defaultValue: {
      username: !usernameTaken.usernameTaken
        ? username
        : convertToValidUrlPath(
            customer.firstName || '',
            customer.lastName || '',
            true,
          ),
      aboutMe: '',
      shortDescription: '',
      professions: [],
      specialties: [],
      speaks: [],
      yearsExperience: '1',
      social: {
        instagram: '',
        facebook: '',
        twitter: '',
        youtube: '',
        website: '',
      },
      gender: 'female',
    } as z.infer<typeof schema>,
  });
}

export default function AccountBusiness() {
  const lastSubmission = useActionData<typeof action>();
  const {professionOptions, defaultValue, specialityOptions} =
    useLoaderData<typeof loader>();

  const [
    form,
    {
      username,
      shortDescription,
      aboutMe,
      gender,
      speaks,
      yearsExperience,
      social,
      professions,
      specialties,
    },
  ] = useForm({
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

  const {instagram, x, youtube, facebook} = useFieldset(form.ref, social);

  const fetcher = useFetcher<UserUsernameTakenResponsePayload>();

  const onChangeUsername = (event: React.ChangeEvent<HTMLInputElement>) => {
    fetcher.load(`/api/usernameTaken?username=${event.target.value}`);
  };

  return (
    <>
      <AccountTitle heading="Register selvstændig" />

      <AccountContent>
        <Text mb="md">
          Du er igang med at register dig på bySisters som selvstændig
          skønhedsekspert, det betyder at du nu kan modtag bookings fra kunder
          der er interesseret i din ydelser som du tilbyder via bysisters.dk
        </Text>

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
              label="Hvad er din køn?"
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

            <TextInput
              label="Års erfaring"
              {...conform.input(yearsExperience)}
            />

            <MultiTags
              field={specialties}
              data={specialityOptions}
              name="specialties"
              label="Hvad er dine specialer?"
              placeholder="Vælge special(er)?"
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

            <TextInput
              label="Skriv kort beskrivelse"
              {...conform.input(shortDescription)}
            />
            <Textarea
              label="Om mig"
              placeholder="Fortæl om dig selv"
              {...conform.input(aboutMe)}
              error={aboutMe.error && 'Udfyld venligst din biografi'}
              minRows={10}
            />

            <TextInput
              leftSectionPointerEvents="none"
              leftSection={<IconAt style={{width: rem(16), height: rem(16)}} />}
              label="Instagram"
              placeholder="Instagram profil"
              {...conform.input(instagram)}
            />

            <TextInput
              leftSectionPointerEvents="none"
              leftSection={<IconAt style={{width: rem(16), height: rem(16)}} />}
              label="Twitter (X)"
              placeholder="Twitter (X)"
              {...conform.input(x)}
            />

            <TextInput
              leftSectionPointerEvents="none"
              leftSection={<IconAt style={{width: rem(16), height: rem(16)}} />}
              label="Facebook"
              placeholder="Facebook profil"
              {...conform.input(facebook)}
            />

            <TextInput
              leftSectionPointerEvents="none"
              leftSection={<IconAt style={{width: rem(16), height: rem(16)}} />}
              label="Youtube"
              placeholder="Youtube profil"
              {...conform.input(youtube)}
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
