import {
  BackgroundImage,
  Blockquote,
  Button,
  Flex,
  Paper,
  rem,
  Stack,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import {
  Form,
  useActionData,
  useLoaderData,
  useNavigation,
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
import {CUSTOMER_DETAILS_QUERY} from '~/graphql/customer-account/CustomerDetailsQuery';
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

  const {data, errors} = await context.customerAccount.query(
    CUSTOMER_DETAILS_QUERY,
  );

  if (errors?.length || !data?.customer) {
    throw new Error('Customer not found');
  }

  if (data.customer.firstName && data.customer.lastName) {
    return redirect('/account/dashboard');
  }

  return json(data, {
    headers: {
      'Set-Cookie': await context.session.commit(),
    },
  });
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
  const loader = useLoaderData<{customer: CustomerFragment}>();
  const {state} = useNavigation();
  const action = useActionData<ActionResponse>();
  const customer = action?.customer ?? loader?.customer;

  return (
    <BackgroundImage
      mih={rem('900px')}
      bgsz="cover"
      src="https://cdn.shopify.com/s/files/1/0682/4060/5458/files/wepik-export-20240410204607VHiw.jpg?v=1712781996"
    >
      <Flex justify="center" align="center">
        <Paper
          radius={0}
          component={Form}
          method="PUT"
          p="30"
          mih={rem('900px')}
          maw={{base: '100%', xs: rem('450px')}}
          pt={rem(80)}
        >
          <Title order={2} ta="center" my="md">
            Velkommen til vores platform
          </Title>

          <Text c="dimmed" mb={50}>
            For at gøre din oplevelse hos os mere personlig og effektiv, bedes
            du venligst oplyse dit fornavn og efternavn.{' '}
          </Text>

          {action?.error ? (
            <Blockquote color="red" my="md" data-testid="required-notification">
              <strong>Fejl:</strong>
              <br />
              {action.error}
            </Blockquote>
          ) : null}

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

            <Button
              type="submit"
              loading={state !== 'idle'}
              data-testid="submit-button"
              fullWidth
            >
              Gem og fortsæt
            </Button>
          </Stack>
        </Paper>
      </Flex>
    </BackgroundImage>
  );
}
