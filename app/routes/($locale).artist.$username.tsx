import {json, type LoaderFunctionArgs} from '@shopify/remix-oxygen';

import {
  ActionIcon,
  Alert,
  AppShell,
  Box,
  Button,
  Group,
  Image,
  rem,
  ScrollArea,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import {useMediaQuery} from '@mantine/hooks';
import {Link, Outlet, useLoaderData} from '@remix-run/react';
import {IconInfoCircle, IconLogout} from '@tabler/icons-react';
import {UserProvider} from '~/hooks/use-user';
import {getBookingShopifyApi} from '~/lib/api/bookingShopifyApi';

export function shouldRevalidate() {
  return false;
}

export async function loader({params}: LoaderFunctionArgs) {
  const {username} = params;

  if (!username) {
    throw new Error('Invalid request method');
  }

  const {payload: user} = await getBookingShopifyApi().userGet(username);

  return json({
    user,
  });
}

export default function UserIndex() {
  const {user} = useLoaderData<typeof loader>();
  const isMobile = useMediaQuery('(max-width: 48em)');

  return (
    <UserProvider user={user}>
      <AppShell
        withBorder={false}
        header={{height: 120, collapsed: !isMobile}}
        navbar={{width: '30%', breakpoint: 'sm', collapsed: {mobile: isMobile}}}
        padding="md"
      >
        <AppShell.Header p="md" bg={`${user.theme?.color || 'pink'}.6`}>
          <Group h="100%">
            <Image
              src={user.images?.profile?.url}
              fallbackSrc={`https://placehold.co/300x300?text=${user.username}`}
              radius="100%"
              w="auto"
              h="100%"
            />
            <div>
              <Title order={1}>{user.fullname}</Title>
              <Text fz="md">
                {user.shortDescription} <br />
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
        <AppShell.Navbar bg={`${user.theme?.color || 'pink'}.6`}>
          <AppShell.Section grow p={rem(48)} component={ScrollArea}>
            <Stack gap="lg">
              <Image
                src={user.images?.profile?.url}
                fallbackSrc={`https://placehold.co/300x300?text=${user.username}`}
                radius="100%"
                w="50%"
                h="auto"
              />

              <Title order={1}>{user.fullname}</Title>
              <Text fz="lg">
                {user.shortDescription} <br />
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
        <AppShell.Main>
          <Box p={{base: '0', sm: rem(48)}}>
            {!user.active ? (
              <Alert
                variant="light"
                color="red"
                title="Bruger ikke aktiv"
                icon={<IconInfoCircle />}
                mb="xl"
              >
                Din bruger er ikke aktiv, men du kan se din profil side indtil
                vi godkender den.
              </Alert>
            ) : null}
            <Outlet />
          </Box>
        </AppShell.Main>
      </AppShell>
    </UserProvider>
  );
}
