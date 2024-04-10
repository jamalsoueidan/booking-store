import {
  Anchor,
  BackgroundImage,
  Button,
  Container,
  Flex,
  Paper,
  PasswordInput,
  Stack,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import {Form, Link, useActionData} from '@remix-run/react';
import {
  json,
  redirect,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
} from '@shopify/remix-oxygen';
import type {CustomerCreateMutation} from 'storefrontapi.generated';

type ActionResponse = {
  error: string | null;
  newCustomer:
    | NonNullable<CustomerCreateMutation['customerCreate']>['customer']
    | null;
};

export async function loader({context}: LoaderFunctionArgs) {
  const customerAccessToken = await context.session.get('customerAccessToken');
  if (customerAccessToken) {
    return redirect('/account');
  }

  return json({});
}

export async function action({request, context}: ActionFunctionArgs) {
  if (request.method !== 'POST') {
    return json({error: 'Method not allowed'}, {status: 405});
  }

  const {storefront, session} = context;
  const form = await request.formData();
  const email = String(form.has('email') ? form.get('email') : '');
  const password = form.has('password') ? String(form.get('password')) : null;
  const passwordConfirm = form.has('passwordConfirm')
    ? String(form.get('passwordConfirm'))
    : null;

  const validPasswords =
    password && passwordConfirm && password === passwordConfirm;

  const validInputs = Boolean(email && password);
  try {
    if (!validPasswords) {
      throw new Error('Passwords do not match');
    }

    if (!validInputs) {
      throw new Error('Please provide both an email and a password.');
    }

    const {customerCreate} = await storefront.mutate(CUSTOMER_CREATE_MUTATION, {
      variables: {
        input: {email, password},
      },
    });

    if (customerCreate?.customerUserErrors?.length) {
      throw new Error(customerCreate?.customerUserErrors[0].message);
    }

    const newCustomer = customerCreate?.customer;
    if (!newCustomer?.id) {
      throw new Error('Could not create customer');
    }

    // get an access token for the new customer
    const {customerAccessTokenCreate} = await storefront.mutate(
      REGISTER_LOGIN_MUTATION,
      {
        variables: {
          input: {
            email,
            password,
          },
        },
      },
    );

    if (!customerAccessTokenCreate?.customerAccessToken?.accessToken) {
      throw new Error('Missing access token');
    }
    session.set(
      'customerAccessToken',
      customerAccessTokenCreate?.customerAccessToken,
    );

    return json(
      {error: null, newCustomer},
      {
        status: 302,
        headers: {
          'Set-Cookie': await session.commit(),
          Location: '/account',
        },
      },
    );
  } catch (error: unknown) {
    if (error instanceof Error) {
      return json({error: error.message}, {status: 400});
    }
    return json({error}, {status: 400});
  }
}

export default function Register() {
  const data = useActionData<ActionResponse>();
  const error = data?.error || null;

  return (
    <BackgroundImage
      src="https://cdn.shopify.com/s/files/1/0682/4060/5458/files/wepik-export-20240410204607VHiw.jpg?v=1712781996"
      p={50}
      mih="100vh"
    >
      <Container w={{base: '100%', sm: '70%', md: '60%', lg: '40%'}}>
        <Title order={1} ta="center">
          Opret en konto!
        </Title>
        <Stack justify="center" gap="lg">
          <Text c="dimmed" ta="center">
            Velkommen til vores fællesskab! Vi er begejstrede for, at du har
            valgt at registrere dig og blive en del af vores platform...
          </Text>
        </Stack>

        <Paper withBorder shadow="md" p={30} mt={30} radius="md">
          <Form method="POST">
            <TextInput
              label="Email adresse"
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              placeholder="Email adresse"
              // eslint-disable-next-line jsx-a11y/no-autofocus
              autoFocus
              data-cy="email-input"
            />
            <PasswordInput
              label="Adgangskode"
              id="password"
              name="password"
              placeholder="Adgangskode"
              required
              autoComplete="new-password"
              minLength={8}
              mt="md"
              data-cy="password-input"
            />
            <PasswordInput
              label="Bekræft adgangskode"
              id="passwordConfirm"
              name="passwordConfirm"
              placeholder="Gentag adgangskode"
              required
              autoComplete="new-password"
              minLength={8}
              mt="md"
              data-cy="password-confirm-input"
            />
            {error && (
              <Text c="red" size="sm" mt="md">
                <small>{error}</small>
              </Text>
            )}
            <Flex justify="center">
              <Button
                color="pink"
                mt="xl"
                type="submit"
                data-cy="register-button"
              >
                Registrer mig!
              </Button>
            </Flex>

            <Text ta="center" mt="md">
              Har du allerede en konto?{' '}
              <Anchor component={Link} to="/account/login" size="sm" c="pink">
                Login →
              </Anchor>
            </Text>
          </Form>
        </Paper>

        <Text c="dimmed" ta="center" mt="xl">
          ...ved at oprette en konto her, åbner du døren til en verden af
          muligheder inden for skønhedspleje og wellness. Når din registrering
          er gennemført, har du mulighed for at opgradere din konto til en
          business-konto. Dette skridt er dit springbræt til at blive anerkendt
          som en skønhedsekspert på vores hjemmeside. Som ekspert kan du ikke
          blot tilbyde din ekspertise og dine behandlinger til et bredt
          publikum, men også selv booke behandlinger hos andre talentfulde
          professionelle inden for skønhedspleje.
        </Text>
      </Container>
    </BackgroundImage>
  );
}

// NOTE: https://shopify.dev/docs/api/storefront/latest/mutations/customerCreate
const CUSTOMER_CREATE_MUTATION = `#graphql
  mutation customerCreate(
    $input: CustomerCreateInput!,
    $country: CountryCode,
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    customerCreate(input: $input) {
      customer {
        id
      }
      customerUserErrors {
        code
        field
        message
      }
    }
  }
` as const;

// NOTE: https://shopify.dev/docs/api/storefront/latest/mutations/customeraccesstokencreate
const REGISTER_LOGIN_MUTATION = `#graphql
  mutation registerLogin(
    $input: CustomerAccessTokenCreateInput!,
    $country: CountryCode,
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
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
