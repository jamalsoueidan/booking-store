import {
  json,
  type LoaderFunctionArgs,
  type MetaFunction,
} from '@shopify/remix-oxygen';

import {
  ActionIcon,
  Alert,
  AppShell,
  Avatar,
  Box,
  Button,
  Group,
  rem,
  ScrollArea,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import {useMediaQuery} from '@mantine/hooks';
import tiptapStyles from '@mantine/tiptap/styles.css?url';
import {Link, Outlet, useLoaderData} from '@remix-run/react';
import {IconInfoCircle, IconLogout} from '@tabler/icons-react';
import {ArtistUser} from '~/graphql/artist/ArtistUser';
import {UserProvider} from '~/hooks/use-user';
import {useUserMetaobject} from '~/hooks/useUserMetaobject';

export function links() {
  return [{rel: 'stylesheet', href: tiptapStyles}];
}

export function shouldRevalidate() {
  return false;
}

export const meta: MetaFunction<typeof loader> = ({data}) => {
  return [
    {
      title: `BySisters | ${
        data?.user?.fields.find((k) => k.key === 'fullname')?.value ?? ''
      }`,
    },
  ];
};

export async function loader({params, context}: LoaderFunctionArgs) {
  const {storefront} = context;
  const {username} = params;

  if (!username) {
    throw new Error('Invalid request method');
  }

  const {metaobject: user} = await storefront.query(ArtistUser, {
    variables: {
      username,
    },
  });

  return json({
    user,
  });
}

export default function UserIndex() {
  const {user} = useLoaderData<typeof loader>();
  const isMobile = useMediaQuery('(max-width: 48em)');

  const {username, fullname, active, shortDescription, image, theme} =
    useUserMetaobject(user);

  return (
    <UserProvider user={user}>
      <AppShell
        withBorder={false}
        header={{height: 120, collapsed: !isMobile}}
        navbar={{width: '30%', breakpoint: 'sm', collapsed: {mobile: isMobile}}}
        padding="md"
      >
        <AppShell.Header p="md" bg={`${theme || 'pink'}.6`}>
          <Group h="100%">
            <Avatar
              src={
                image.image?.url ||
                `https://placehold.co/300x300?text=${username}`
              }
              size="86"
            />
            <div>
              <Title order={1}>{fullname}</Title>
              <Text fz="md">
                {shortDescription} <br />
              </Text>
            </div>
          </Group>
          <div style={{position: 'fixed', top: 10, right: 10}}>
            <ActionIcon
              variant="outline"
              color="black"
              size="lg"
              radius="xl"
              component={Link}
              to="/"
            >
              <IconLogout />
            </ActionIcon>
          </div>
        </AppShell.Header>
        <AppShell.Navbar bg={`${theme || 'pink'}.6`}>
          <AppShell.Section grow p={rem(48)} component={ScrollArea}>
            <Stack gap="lg">
              <Avatar
                src={
                  image.image?.url ||
                  `https://placehold.co/300x300?text=${username}`
                }
                size="300"
              />

              <Title order={1}>{fullname}</Title>
              <Text fz="lg">
                {shortDescription} <br />
              </Text>
            </Stack>
          </AppShell.Section>
          <AppShell.Section p={rem(48)}>
            <Button
              variant="outline"
              color="black"
              size="lg"
              radius="xl"
              component={Link}
              to="/"
              leftSection={<IconLogout />}
            >
              By Sisters
            </Button>
          </AppShell.Section>
        </AppShell.Navbar>
        <AppShell.Main bg="gray.1">
          <Box p={{base: '0', sm: rem(48)}}>
            {!active ? (
              <Alert
                variant="light"
                color={theme}
                title="Din konto er inaktiv"
                icon={<IconInfoCircle />}
                mb="xl"
              >
                Din konto er pt. ikke aktiv, men du kan stadig tilgå din
                profilside, indtil den bliver godkendt.
              </Alert>
            ) : null}
            <Outlet />
          </Box>
        </AppShell.Main>
      </AppShell>
    </UserProvider>
  );
}
