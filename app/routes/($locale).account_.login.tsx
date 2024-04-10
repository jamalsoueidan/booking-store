import {
  Anchor,
  BackgroundImage,
  Button,
  Checkbox,
  Container,
  Flex,
  Group,
  Paper,
  PasswordInput,
  Text,
  TextInput,
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
  return [{title: 'Login'}];
};

export async function loader({context}: LoaderFunctionArgs) {
  if (await context.session.get('customerAccessToken')) {
    return redirect('/account');
  }
  return json({});
}

export async function action({request, context}: ActionFunctionArgs) {
  const {session, storefront} = context;

  if (request.method !== 'POST') {
    return json({error: 'Method not allowed'}, {status: 405});
  }

  try {
    const form = await request.formData();
    const email = String(form.has('email') ? form.get('email') : '');
    const password = String(form.has('password') ? form.get('password') : '');
    const validInputs = Boolean(email && password);

    if (!validInputs) {
      throw new Error('Please provide both an email and a password.');
    }

    const {customerAccessTokenCreate} = await storefront.mutate(
      LOGIN_MUTATION,
      {
        variables: {
          input: {email, password},
        },
      },
    );

    if (!customerAccessTokenCreate?.customerAccessToken?.accessToken) {
      throw new Error(customerAccessTokenCreate?.customerUserErrors[0].message);
    }

    const {customerAccessToken} = customerAccessTokenCreate;
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

export default function Login() {
  const data = useActionData<ActionResponse>();
  const error = data?.error || null;

  return (
    <BackgroundImage
      src="https://cdn.shopify.com/s/files/1/0682/4060/5458/files/wepik-export-20240410204607VHiw.jpg?v=1712781996"
      p={50}
      mih="100vh"
    >
      <Container w={{base: '100%', sm: '70%', md: '60%', lg: '40%'}}>
        <Title ta="center">Velkommen tilbage!</Title>
        <Text size="sm" ta="center" mt={5}>
          Har du ikke en konto endnu?{' '}
          <Anchor
            size="sm"
            component={Link}
            c="pink"
            fw="bold"
            to="/account/register"
            data-cy="register-link"
          >
            Opret konto
          </Anchor>
        </Text>

        <Paper withBorder shadow="md" p={30} mt={30} radius="md">
          <Form method="POST">
            <TextInput
              label="Emailadresse"
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              placeholder="Din emailadresse"
              data-cy="email-input"
            />
            <PasswordInput
              label="Adgangskode"
              id="password"
              name="password"
              placeholder="Din adgangskode"
              required
              mt="md"
              data-cy="password-input"
            />

            <Group justify="space-between" mt="lg">
              <Checkbox label="Husk mig" />
            </Group>

            <Flex justify="center">
              <Button color="pink" mt="xl" type="submit" data-cy="login-button">
                Log ind
              </Button>
            </Flex>

            <Text ta="center" mt="md">
              <Anchor c="pink" component={Link} to="/account/recover" size="sm">
                Glemt adgangskode?
              </Anchor>
            </Text>

            {error ? (
              <p>
                <mark>
                  <small>{error}</small>
                </mark>
              </p>
            ) : null}
          </Form>
        </Paper>
      </Container>
    </BackgroundImage>
  );
}

// NOTE: https://shopify.dev/docs/api/storefront/latest/mutations/customeraccesstokencreate
const LOGIN_MUTATION = `#graphql
  mutation login($input: CustomerAccessTokenCreateInput!) {
    customerAccessTokenCreate(input: $input) {
      customerUserErrors {
        code
        field
        message
      }
      customerAccessToken {
        accessToken
        expiresAt
      }
    }
  }
` as const;
