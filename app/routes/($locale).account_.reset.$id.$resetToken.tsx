import {
  Anchor,
  Button,
  Container,
  Paper,
  PasswordInput,
  Text,
  Title,
} from '@mantine/core';
import {Link, useActionData, type MetaFunction} from '@remix-run/react';
import {json, redirect, type ActionFunctionArgs} from '@shopify/remix-oxygen';

type ActionResponse = {
  error: string | null;
};

export const meta: MetaFunction = () => {
  return [{title: 'Reset Password'}];
};

export async function action({request, context, params}: ActionFunctionArgs) {
  if (request.method !== 'POST') {
    return json({error: 'Method not allowed'}, {status: 405});
  }
  const {id, resetToken} = params;
  const {session, storefront} = context;

  try {
    if (!id || !resetToken) {
      throw new Error('customer token or id not found');
    }

    const form = await request.formData();
    const password = form.has('password') ? String(form.get('password')) : '';
    const passwordConfirm = form.has('passwordConfirm')
      ? String(form.get('passwordConfirm'))
      : '';
    const validInputs = Boolean(password && passwordConfirm);
    if (validInputs && password !== passwordConfirm) {
      throw new Error('Please provide matching passwords');
    }

    const {customerReset} = await storefront.mutate(CUSTOMER_RESET_MUTATION, {
      variables: {
        id: `gid://shopify/Customer/${id}`,
        input: {password, resetToken},
      },
    });

    if (customerReset?.customerUserErrors?.length) {
      throw new Error(customerReset?.customerUserErrors[0].message);
    }

    if (!customerReset?.customerAccessToken) {
      throw new Error('Access token not found. Please try again.');
    }
    session.set('customerAccessToken', customerReset.customerAccessToken);

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

export default function Reset() {
  const action = useActionData<ActionResponse>();
  const error = action?.error || null;

  return (
    <Container size={420} my={40}>
      <Title order={1} ta="center">
        Nulstil adgangskode
      </Title>
      <Text size="sm" ta="center" mt="md">
        Indtast en ny adgangskode for din konto.
      </Text>

      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <form method="POST">
          <PasswordInput
            label="Adgangskode"
            id="password"
            name="password"
            type="password"
            placeholder="Din adgangskode"
            required
            // eslint-disable-next-line jsx-a11y/no-autofocus
            autoFocus
            autoComplete="new-password"
          />
          <PasswordInput
            label="Bekræft adgangskode"
            id="passwordConfirm"
            name="passwordConfirm"
            type="password"
            placeholder="Gentag adgangskode"
            required
            mt="md"
          />
          {action?.error && (
            <Text size="sm" mt="md">
              {action.error}
            </Text>
          )}
          <Button fullWidth mt="xl" type="submit">
            Nulstil
          </Button>
          {error ? (
            <p>
              <mark>
                <small>{error}</small>
              </mark>
            </p>
          ) : (
            <br />
          )}
        </form>
      </Paper>

      <Text ta="center" mt="md">
        <Anchor component={Link} to="/account/login" size="sm">
          Tilbage til login →
        </Anchor>
      </Text>
    </Container>
  );
}

// NOTE: https://shopify.dev/docs/api/storefront/latest/mutations/customerreset
const CUSTOMER_RESET_MUTATION = `#graphql
  mutation customerReset(
    $id: ID!,
    $input: CustomerResetInput!
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    customerReset(id: $id, input: $input) {
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
