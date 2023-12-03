import {conform, useFieldset, useForm} from '@conform-to/react';
import {parse} from '@conform-to/zod';
import {
  Divider,
  Flex,
  Group,
  Radio,
  Stack,
  Text,
  TextInput,
  Textarea,
  Title,
  rem,
} from '@mantine/core';
import {Form, useActionData, useLoaderData} from '@remix-run/react';
import {parseGid} from '@shopify/hydrogen';
import {
  json,
  redirect,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
} from '@shopify/remix-oxygen';
import {SubmitButton} from '~/components/form/SubmitButton';

import {IconAt} from '@tabler/icons-react';
import {type z} from 'zod';
import {MultiTags} from '~/components/form/MultiTags';
import {getBookingShopifyApi} from '~/lib/api/bookingShopifyApi';
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
      redirectUrl: `/account/dashboard`,
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

  return json({
    customer,
    professionOptions,
    specialityOptions,
    defaultValue: {
      username: convertToValidUrlPath(
        customer?.firstName || '',
        customer?.lastName || '',
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
  const {customer, professionOptions, defaultValue, specialityOptions} =
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

  const {instagram, twitter, youtube} = useFieldset(form.ref, social);

  return (
    <>
      <Flex direction={'row'} align={'center'}>
        <Title>Register selvstændig</Title>
      </Flex>
      <Divider my="md" />
      <Text mb="md">
        Du er igang med at register dig på bySisters som selvstændig
        skønhedsekspert, det betyder at du nu kan modtag bookings fra kunder der
        er interesseret i din ydelser som du tilbyder via bysisters.dk
      </Text>

      <Form method="post" {...form.props}>
        <Stack gap="md">
          <TextInput label="Vælge en profilnavn" {...conform.input(username)} />

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

          <TextInput label="Års erfaring" {...conform.input(yearsExperience)} />

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
            {...conform.input(twitter)}
          />

          <TextInput
            leftSectionPointerEvents="none"
            leftSection={<IconAt style={{width: rem(16), height: rem(16)}} />}
            label="Youtube"
            placeholder="Youtube profil"
            {...conform.input(youtube)}
          />

          <SubmitButton>Opret en business konto</SubmitButton>
        </Stack>
      </Form>
    </>
  );
}

function convertToValidUrlPath(firstName: string, lastName: string): string {
  const allowedCharactersRegex = /[^a-zA-Z0-9\-_]/g;
  firstName = firstName.replace(allowedCharactersRegex, '');
  lastName = lastName.replace(allowedCharactersRegex, '');
  const urlPath = `${firstName}-${lastName}`;
  return urlPath?.toLowerCase();
}
