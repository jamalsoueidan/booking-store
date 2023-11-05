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
          <Title ta="center">Request Sent.</Title>
          <Text c="dimmed" fz="sm" ta="center">
            If that email address is in our system, you will receive an email
            with instructions about how to reset your password in a few minutes.{' '}
            <Anchor size="sm" href="/account/login">
              Return to Login
            </Anchor>
          </Text>
        </>
      ) : (
        <>
          <Title ta="center">Forgot your password?</Title>
          <Text c="dimmed" fz="sm" ta="center">
            Enter your email to get a reset link
          </Text>

          <Paper withBorder shadow="md" p={30} radius="md" mt="xl">
            <Form method="POST">
              <TextInput
                aria-label="Email address"
                autoComplete="email"
                // eslint-disable-next-line jsx-a11y/no-autofocus
                autoFocus
                id="email"
                name="email"
                placeholder="Email address"
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
                    <Box ml={5}>Back to the login page</Box>
                  </Center>
                </Anchor>
                <Button type="submit">Reset password</Button>
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
