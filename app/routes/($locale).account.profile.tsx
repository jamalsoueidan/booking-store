import {
  Blockquote,
  Button,
  Checkbox,
  Group,
  Stack,
  Text,
  TextInput,
} from '@mantine/core';
import {
  Form,
  useActionData,
  useNavigation,
  useOutletContext,
  useSearchParams,
  type MetaFunction,
} from '@remix-run/react';
import {parseGid} from '@shopify/hydrogen';
import type {CustomerUpdateInput} from '@shopify/hydrogen/storefront-api-types';
import {
  json,
  redirect,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
} from '@shopify/remix-oxygen';
import type {CustomerFragment} from 'storefrontapi.generated';
import {AccountContent} from '~/components/account/AccountContent';
import {AccountTitle} from '~/components/account/AccountTitle';
import {getBookingShopifyApi} from '~/lib/api/bookingShopifyApi';
import {CUSTOMER_QUERY} from './($locale).account';
export type ActionResponse = {
  error: string | null;
  customer: CustomerFragment | null;
};

export const meta: MetaFunction = () => {
  return [{title: 'Profile'}];
};

export async function loader({context}: LoaderFunctionArgs) {
  const customerAccessToken = await context.session.get('customerAccessToken');
  if (!customerAccessToken) {
    return redirect('/account/login');
  }
  return json({});
}

export async function action({request, context}: ActionFunctionArgs) {
  const {session, storefront} = context;

  if (request.method !== 'PUT') {
    return json({error: 'Method not allowed'}, {status: 405});
  }

  const form = await request.formData();
  const customerAccessToken = await session.get('customerAccessToken');
  if (!customerAccessToken) {
    return json({error: 'Unauthorized'}, {status: 401});
  }

  try {
    const customer: CustomerUpdateInput = {};
    const validInputKeys = ['firstName', 'lastName', 'email', 'phone'] as const;
    for (const [key, value] of form.entries()) {
      if (!validInputKeys.includes(key as any)) {
        continue;
      }
      if (key === 'acceptsMarketing') {
        customer.acceptsMarketing = value === 'on';
      }
      if (typeof value === 'string' && value.length) {
        customer[key as (typeof validInputKeys)[number]] = value;
      }
    }

    // update customer and possibly password
    const updated = await storefront.mutate(CUSTOMER_UPDATE_MUTATION, {
      variables: {
        customerAccessToken: customerAccessToken.accessToken,
        customer,
      },
    });

    // check for mutation errors
    if (updated.customerUpdate?.customerUserErrors?.length) {
      return json(
        {error: updated.customerUpdate?.customerUserErrors[0]},
        {status: 400},
      );
    }

    // update session with the updated access token
    if (updated.customerUpdate?.customerAccessToken?.accessToken) {
      session.set(
        'customerAccessToken',
        updated.customerUpdate?.customerAccessToken,
      );
    }

    // if coming from business page
    const url = new URL(request.url);
    const searchParams = new URLSearchParams(url.search);

    const comingFromBusiness = Boolean(
      searchParams.has('firstName') || searchParams.has('lastName'),
    );

    const {customer: customerData} = await context.storefront.query(
      CUSTOMER_QUERY,
      {
        variables: {
          customerAccessToken: customerAccessToken.accessToken,
          country: context.storefront.i18n.country,
          language: context.storefront.i18n.language,
        },
        cache: context.storefront.CacheNone(),
      },
    );

    if (!comingFromBusiness) {
      await getBookingShopifyApi().customerUpdate(
        parseGid(customerData?.id).id,
        {
          phone: customer.phone || '',
          email: customer.email || '',
          fullname: `${customer.firstName} ${customer.lastName}`,
        },
      );
    }

    if (comingFromBusiness) {
      return redirect('/account/business', {
        headers: {
          'Set-Cookie': await session.commit(),
        },
      });
    }

    return json(
      {error: null, customer: updated.customerUpdate?.customer},
      {
        headers: {
          'Set-Cookie': await session.commit(),
        },
      },
    );
  } catch (error: any) {
    return json({error: error.message, customer: null}, {status: 400});
  }
}

export default function AccountProfile() {
  const account = useOutletContext<{customer: CustomerFragment}>();
  const {state} = useNavigation();
  const action = useActionData<ActionResponse>();
  const [searchParams] = useSearchParams();
  const customer = action?.customer ?? account?.customer;

  const comingFromBusiness = Boolean(
    searchParams.has('firstName') || searchParams.has('lastName'),
  );

  return (
    <>
      <AccountTitle heading="Personlige oplysninger" />

      <AccountContent>
        {comingFromBusiness ? (
          <Blockquote color="lime" my="md">
            Før du kan register dig som skønhedsekspert, bedes du udfylde alle
            felter og trykke på gem.
          </Blockquote>
        ) : undefined}

        <Form method="PUT">
          <Stack>
            <TextInput
              label="Fornavn"
              id="firstName"
              name="firstName"
              type="text"
              autoComplete="given-name"
              placeholder="Fornavn"
              aria-label="Fornavn"
              defaultValue={customer.firstName ?? ''}
              required
              minLength={2}
            />
            <TextInput
              label="Efternavn"
              id="lastName"
              name="lastName"
              type="text"
              autoComplete="family-name"
              placeholder="Efternavn"
              aria-label="Efternavn"
              defaultValue={customer.lastName ?? ''}
              required
              minLength={2}
            />
            <TextInput
              label="Mobil"
              id="phone"
              name="phone"
              type="tel"
              autoComplete="tel"
              placeholder="Mobil"
              aria-label="Mobil"
              defaultValue={customer.phone ?? ''}
            />
            <TextInput
              label="Emailadresse"
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="Emailadresse"
              aria-label="Emailadresse"
              defaultValue={customer.email ?? ''}
              required
            />
            <Group>
              <Checkbox
                id="acceptsMarketing"
                name="acceptsMarketing"
                label="Tilmeldt markedsføringskommunikation"
                defaultChecked={customer.acceptsMarketing}
              />
            </Group>

            {action?.error && (
              <Text color="red" size="sm">
                {action.error}
              </Text>
            )}
            <div>
              <Button type="submit" loading={state !== 'idle'}>
                {comingFromBusiness ? 'Gem og gå videre...' : 'Opdater'}
              </Button>
            </div>
          </Stack>
        </Form>
      </AccountContent>
    </>
  );
}

function getPassword(form: FormData): string | undefined {
  let password;
  const currentPassword = form.get('currentPassword');
  const newPassword = form.get('newPassword');
  const newPasswordConfirm = form.get('newPasswordConfirm');

  let passwordError;
  if (newPassword && !currentPassword) {
    passwordError = new Error('Current password is required.');
  }

  if (newPassword && newPassword !== newPasswordConfirm) {
    passwordError = new Error('New passwords must match.');
  }

  if (newPassword && currentPassword && newPassword === currentPassword) {
    passwordError = new Error(
      'New password must be different than current password.',
    );
  }

  if (passwordError) {
    throw passwordError;
  }

  if (currentPassword && newPassword) {
    password = newPassword;
  } else {
    password = currentPassword;
  }

  return String(password);
}

const CUSTOMER_UPDATE_MUTATION = `#graphql
  # https://shopify.dev/docs/api/storefront/latest/mutations/customerUpdate
  mutation customerUpdate(
    $customerAccessToken: String!,
    $customer: CustomerUpdateInput!
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(language: $language, country: $country) {
    customerUpdate(customerAccessToken: $customerAccessToken, customer: $customer) {
      customer {
        acceptsMarketing
        email
        firstName
        id
        lastName
        phone
      }
      customerAccessToken {
        accessToken
        expiresAt
      }
      customerUserErrors {
        code
        field
        message
      }
    }
  }
` as const;
