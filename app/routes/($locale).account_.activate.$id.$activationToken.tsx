import {
  Anchor,
  Button,
  Container,
  Paper,
  PasswordInput,
  Text,
  Title,
} from '@mantine/core';
import {Form, Link, useActionData, type MetaFunction} from '@remix-run/react';
import {
  json,
  redirect,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
} from '@shopify/remix-oxygen';

type ActionResponse = {
  error: string | null;
};

export const meta: MetaFunction = () => {
  return [{title: 'Activate Account'}];
};

export async function loader({context}: LoaderFunctionArgs) {
  if (await context.session.get('customerAccessToken')) {
    return redirect('/account');
  }
  return json({});
}

export async function action({request, context, params}: ActionFunctionArgs) {
  const {session, storefront} = context;
  const {id, activationToken} = params;

  if (request.method !== 'POST') {
    return json({error: 'Method not allowed'}, {status: 405});
  }

  try {
    if (!id || !activationToken) {
      throw new Error('Missing token. The link you followed might be wrong.');
    }

    const form = await request.formData();
    const password = form.has('password') ? String(form.get('password')) : null;
    const passwordConfirm = form.has('passwordConfirm')
      ? String(form.get('passwordConfirm'))
      : null;

    const validPasswords =
      password && passwordConfirm && password === passwordConfirm;

    if (!validPasswords) {
      throw new Error('Passwords do not match');
    }

    const {customerActivate} = await storefront.mutate(
      CUSTOMER_ACTIVATE_MUTATION,
      {
        variables: {
          id: `gid://shopify/Customer/${id}`,
          input: {
            password,
            activationToken,
          },
        },
      },
    );

    if (customerActivate?.customerUserErrors?.length) {
      throw new Error(customerActivate.customerUserErrors[0].message);
    }

    const {customerAccessToken} = customerActivate ?? {};
    if (!customerAccessToken) {
      throw new Error('Could not activate account.');
    }
    session.set('customerAccessToken', customerAccessToken);

    return redirect('/account', {
      headers: {
        'Set-Cookie': await session.commit(),
      },
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return json({error: error.message}, {status: 400});
    }
    return json({error}, {status: 400});
  }
}

export default function Activate() {
  const action = useActionData<ActionResponse>();
  const error = action?.error ?? null;

  return (
    <Container size={420} my={40}>
      <Title order={1} ta="center">
        Aktiver Konto.
      </Title>
      <Text size="sm" ta="center">
        Opret din adgangskode for at aktivere din konto.
      </Text>
      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <Form method="POST">
          <PasswordInput
            label="Adgangskode"
            id="password"
            name="password"
            placeholder="Adgangskode"
            required
            // eslint-disable-next-line jsx-a11y/no-autofocus
            autoFocus
            minLength={8}
            autoComplete="new-password"
          />
          <PasswordInput
            label="Bekræft adgangskode"
            id="passwordConfirm"
            name="passwordConfirm"
            placeholder="Gentag adgangskode"
            required
            minLength={8}
            autoComplete="new-password"
            mt="md"
          />
          {error && (
            <Text color="red" size="sm" mt="md">
              <small>{error}</small>
            </Text>
          )}
          <Button fullWidth mt="xl" type="submit">
            Gem
          </Button>
        </Form>
      </Paper>
      <Text ta="center" mt="md">
        Har du brug for hjælp?{' '}
        <Anchor component={Link} to="/help" size="sm">
          Kontakt support
        </Anchor>
      </Text>
    </Container>
  );
}

// NOTE: https://shopify.dev/docs/api/storefront/latest/mutations/customeractivate
const CUSTOMER_ACTIVATE_MUTATION = `#graphql
  mutation customerActivate(
    $id: ID!,
    $input: CustomerActivateInput!,
    $country: CountryCode,
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    customerActivate(id: $id, input: $input) {
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
