import {
  json,
  type LoaderFunctionArgs,
  type MetaFunction,
} from '@shopify/remix-oxygen';

import {
  Alert,
  Avatar,
  Button,
  Container,
  Divider,
  Flex,
  rem,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import {NavLink, Outlet, useLoaderData} from '@remix-run/react';
import {IconInfoCircle} from '@tabler/icons-react';

import {USER_METAOBJECT_QUERY} from '~/graphql/fragments/UserMetaobject';
import {UserProvider} from '~/hooks/use-user';

export function shouldRevalidate() {
  return false;
}

export const meta: MetaFunction<typeof loader> = ({data}) => {
  return [
    {
      title: `BySisters | ${data?.user?.fullname?.value ?? ''}`,
    },
  ];
};

export async function loader({params, context}: LoaderFunctionArgs) {
  const {storefront} = context;
  const {username} = params;

  if (!username) {
    throw new Error('Invalid request method');
  }

  const {metaobject: user} = await storefront.query(USER_METAOBJECT_QUERY, {
    variables: {
      username,
    },
    cache: context.storefront.CacheShort(),
  });

  return json({
    user,
  });
}

export default function UserIndex() {
  const {user} = useLoaderData<typeof loader>();

  return (
    <UserProvider user={user}>
      <Container size="xl" mb="xl">
        <Flex direction="column" mt={rem(100)}>
          <Stack gap="xs">
            <Avatar src={user?.image?.reference?.image?.url} size={rem(150)} />

            <Title order={1}>{user?.fullname?.value}</Title>
            <Text fz="lg">
              {user?.shortDescription?.value} <br />
            </Text>
          </Stack>
        </Flex>

        {!user?.active?.value ? (
          <Alert
            variant="light"
            title="Din konto er inaktiv"
            icon={<IconInfoCircle />}
            mb="xl"
          >
            Din konto er pt. ikke aktiv, men du kan stadig tilgå din profilside,
            indtil den bliver godkendt.
          </Alert>
        ) : null}

        <Flex gap="md" mt={rem(60)}>
          <NavLink to="" end>
            {({isActive}) => (
              <Button
                variant={isActive ? 'filled' : 'transparent'}
                color={isActive ? 'gray.1' : undefined}
                c="black"
                radius="xl"
              >
                Behandlinger
              </Button>
            )}
          </NavLink>
          <NavLink to="about">
            {({isActive}) => (
              <Button
                variant={isActive ? 'filled' : 'transparent'}
                color={isActive ? 'gray.1' : undefined}
                c="black"
                radius="xl"
              >
                Om mig
              </Button>
            )}
          </NavLink>
        </Flex>
        <Divider my="xl" />
        <Outlet />
      </Container>
    </UserProvider>
  );
}
