import {Blockquote, Stack, TextInput} from '@mantine/core';
import {
  Form,
  useActionData,
  useOutletContext,
  type MetaFunction,
} from '@remix-run/react';
import type {CustomerUpdateInput} from '@shopify/hydrogen/customer-account-api-types';
import {
  json,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
} from '@shopify/remix-oxygen';
import type {CustomerFragment} from 'customer-accountapi.generated';
import {AccountContent} from '~/components/account/AccountContent';
import {AccountTitle} from '~/components/account/AccountTitle';
import {SubmitButton} from '~/components/form/SubmitButton';
import {CUSTOMER_UPDATE_MUTATION} from '~/graphql/customer-account/CustomerUpdateMutation';

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
  const action = useActionData<ActionResponse>();
  const customer = action?.customer ?? account?.customer;

  return (
    <>
      <AccountTitle heading="Personlige oplysninger" />

      <AccountContent>
        {action?.error ? (
          <Blockquote color="red" my="md" data-testid="required-notification">
            <strong>Fejl:</strong>
            <br />
            {action.error}
          </Blockquote>
        ) : null}

        <Form method="post">
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
              data-testid="first-name-input"
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
              data-testid="last-name-input"
            />

            <div>
              <SubmitButton>Gem ændringer</SubmitButton>
            </div>
          </Stack>
        </Form>
      </AccountContent>
    </>
  );
}
