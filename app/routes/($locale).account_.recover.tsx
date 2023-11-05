import {
  Anchor,
  Box,
  Button,
  Center,
  Container,
  Group,
  Paper,
  Text,
  TextInput,
  Title,
  rem,
} from '@mantine/core';
import {Form, Link, useActionData} from '@remix-run/react';
import {
  json,
  redirect,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
} from '@shopify/remix-oxygen';
import {IconArrowLeft} from '@tabler/icons-react';

type ActionResponse = {
  error?: string;
  resetRequested?: boolean;
};

export async function loader({context}: LoaderFunctionArgs) {
  const customerAccessToken = await context.session.get('customerAccessToken');
  if (customerAccessToken) {
    return redirect('/account');
  }

  return json({});
}

export async function action({request, context}: ActionFunctionArgs) {
  const {storefront} = context;
  const form = await request.formData();
  const email = form.has('email') ? String(form.get('email')) : null;

  if (request.method !== 'POST') {
    return json({error: 'Method not allowed'}, {status: 405});
  }

  try {
    if (!email) {
      throw new Error('Please provide an email.');
    }
    await storefront.mutate(CUSTOMER_RECOVER_MUTATION, {
      variables: {email},
    });

    return json({resetRequested: true});
  } catch (error: unknown) {
    const resetRequested = false;
    if (error instanceof Error) {
      return json({error: error.message, resetRequested}, {status: 400});
    }
    return json({error, resetRequested}, {status: 400});
  }
}

export default function Recover() {
  const action = useActionData<ActionResponse>();

  return (
    <Container size={460} my={30}>
      {action?.resetRequested ? (
        <>
          <Title ta="center">Anmodning sendt.</Title>
          <Text c="dimmed" fz="sm" ta="center">
            Hvis den e-mailadresse er i vores system, vil du modtage en e-mail
            med instruktioner om, hvordan du nulstiller din adgangskode inden
            for få minutter.{' '}
            <Anchor size="sm" href="/account/login">
              Vend tilbage til login
            </Anchor>
          </Text>
        </>
      ) : (
        <>
          <Title ta="center">Glemt din adgangskode?</Title>
          <Text c="dimmed" fz="sm" ta="center">
            Indtast din e-mail for at få et nulstillingslink
          </Text>

          <Paper withBorder shadow="md" p={30} radius="md" mt="xl">
            <Form method="POST">
              <TextInput
                label="Din e-mail"
                placeholder="Emailadresse"
                autoComplete="email"
                // eslint-disable-next-line jsx-a11y/no-autofocus
                autoFocus
                id="email"
                name="email"
                required
                type="email"
              />
              <Group justify="space-between" mt="lg">
                <Anchor
                  component={Link}
                  to="/account/login"
                  c="dimmed"
                  size="sm"
                >
                  <Center inline>
                    <IconArrowLeft
                      style={{width: rem(12), height: rem(12)}}
                      stroke={1.5}
                    />
                    <Box ml={5}>Tilbage til login-siden</Box>
                  </Center>
                </Anchor>
                <Button type="submit">Nulstil adgangskode</Button>
              </Group>
            </Form>
          </Paper>
        </>
      )}
    </Container>
  );
}

// NOTE: https://shopify.dev/docs/api/storefront/latest/mutations/customerrecover
const CUSTOMER_RECOVER_MUTATION = `#graphql
  mutation customerRecover(
    $email: String!,
    $country: CountryCode,
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    customerRecover(email: $email) {
      customerUserErrors {
        code
        field
        message
      }
    }
  }
` as const;
