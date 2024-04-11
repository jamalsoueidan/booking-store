import {Blockquote, Button, Stack, TextInput} from '@mantine/core';
import {
  Form,
  useActionData,
  useNavigation,
  useOutletContext,
  useSearchParams,
  type MetaFunction,
} from '@remix-run/react';
import type {CustomerUpdateInput} from '@shopify/hydrogen/customer-account-api-types';
import {
  json,
  redirect,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
} from '@shopify/remix-oxygen';
import type {CustomerFragment} from 'customer-accountapi.generated';
import {AccountContent} from '~/components/account/AccountContent';
import {AccountTitle} from '~/components/account/AccountTitle';
import {CUSTOMER_UPDATE_MUTATION} from '~/graphql/customer-account/CustomerUpdateMutation';
import {getBookingShopifyApi} from '~/lib/api/bookingShopifyApi';
import {getCustomer} from '~/lib/get-customer';

export type ActionResponse = {
  error: string | null;
  customer: CustomerFragment | null;
};

export const meta: MetaFunction = () => {
  return [{title: 'Profile'}];
};

export async function loader({context}: LoaderFunctionArgs) {
  await context.customerAccount.handleAuthStatus();

  return json(
    {},
    {
      headers: {
        'Set-Cookie': await context.session.commit(),
      },
    },
  );
}

export async function action({request, context}: ActionFunctionArgs) {
  const {customerAccount} = context;

  if (request.method !== 'PUT') {
    return json({error: 'Method not allowed'}, {status: 405});
  }

  const form = await request.formData();

  try {
    const customer: CustomerUpdateInput = {};
    const validInputKeys = ['firstName', 'lastName'] as const;
    for (const [key, value] of form.entries()) {
      if (!validInputKeys.includes(key as any)) {
        continue;
      }
      if (typeof value === 'string' && value.length) {
        customer[key as (typeof validInputKeys)[number]] = value;
      }
    }

    // update customer and possibly password
    const {data, errors} = await customerAccount.mutate(
      CUSTOMER_UPDATE_MUTATION,
      {
        variables: {
          customer,
        },
      },
    );

    if (errors?.length) {
      throw new Error(errors[0].message);
    }

    if (!data?.customerUpdate?.customer) {
      throw new Error('Customer profile update failed.');
    }

    // coming from business
    const url = new URL(request.url);
    const searchParams = new URLSearchParams(url.search);

    const comingFromBusiness = Boolean(
      searchParams.has('firstName') || searchParams.has('lastName'),
    );

    if (!comingFromBusiness) {
      const customerId = await getCustomer({context});
      await getBookingShopifyApi().customerUpdate(customerId, {
        fullname: `${customer.firstName} ${customer.lastName}`,
      });
    }

    if (comingFromBusiness) {
      return redirect('/account/business', {
        headers: {
          'Set-Cookie': await context.session.commit(),
        },
      });
    }

    return json(
      {
        error: null,
        customer: data?.customerUpdate?.customer,
      },
      {
        headers: {
          'Set-Cookie': await context.session.commit(),
        },
      },
    );
  } catch (error: any) {
    return json(
      {error: error.message, customer: null},
      {
        status: 400,
        headers: {
          'Set-Cookie': await context.session.commit(),
        },
      },
    );
  }
}

export default function AccountProfile() {
  const account = useOutletContext<{customer: CustomerFragment}>();
  const {state} = useNavigation();
  const action = useActionData<ActionResponse>();
  const customer = action?.customer ?? account?.customer;
  const [searchParams] = useSearchParams();

  const comingFromBusiness = Boolean(
    searchParams.has('firstName') || searchParams.has('lastName'),
  );

  return (
    <>
      <AccountTitle heading="Personlige oplysninger" />

      <AccountContent>
        {comingFromBusiness ? (
          <Blockquote color="lime" my="md" data-cy="required-notification">
            Du bedes først udfylde din fornavn og efternavn og trykke på knappen
            i bunden på siden.
          </Blockquote>
        ) : undefined}

        {action?.error ? (
          <Blockquote color="red" my="md" data-cy="required-notification">
            <strong>Fejl:</strong>
            <br />
            {action.error}
          </Blockquote>
        ) : null}

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
              data-cy="first-name-input"
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
              data-cy="last-name-input"
            />

            <div>
              <Button
                type="submit"
                loading={state !== 'idle'}
                data-cy="submit-button"
              >
                {comingFromBusiness ? 'Gem og gå videre...' : 'Opdater'}
              </Button>
            </div>
          </Stack>
        </Form>
      </AccountContent>
    </>
  );
}
