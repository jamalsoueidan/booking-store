import {
  Avatar,
  Button,
  Card,
  Container,
  Divider,
  Flex,
  Grid,
  Group,
  rem,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import {Form, Link, useLoaderData, useOutletContext} from '@remix-run/react';
import {json, type LoaderFunctionArgs} from '@remix-run/server-runtime';
import {
  IconBook,
  IconClock,
  IconCurrencyDollar,
  IconGps,
  IconHeart,
  IconLogout,
  IconParachute,
  IconPlane,
  IconShoppingBag,
} from '@tabler/icons-react';
import {AccountMenuLink} from '~/components/account/AccountMenuLink';
import {useMobile} from '~/hooks/isMobile';
import {getBookingShopifyApi} from '~/lib/api/bookingShopifyApi';
import {getCustomer} from '~/lib/get-customer';
import {modifyImageUrl} from '~/lib/image';
import {type AccountOutlet} from './account';

export async function loader({context}: LoaderFunctionArgs) {
  const customerId = await getCustomer({context});

  const status = await getBookingShopifyApi().customerStatus(customerId);

  return json({
    status: status.payload,
  });
}

export default function AccountIndex() {
  const {status} = useLoaderData<typeof loader>();
  const {customer, user} = useOutletContext<AccountOutlet>();
  const isMobile = useMobile();

  return (
    <Container size="md" my={{base: rem(80), sm: rem(100)}}>
      <Grid align="center">
        <Grid.Col span={{base: 12, sm: 6}}>
          <Card p={{base: 'sm', sm: 'xl'}}>
            <Group>
              {user?.images?.profile?.url ? (
                <Avatar
                  component={Link}
                  to={`/account/upload`}
                  size={isMobile ? 'lg' : 'xl'}
                  src={modifyImageUrl(user?.images?.profile?.url, '50x50')}
                />
              ) : (
                <Avatar size={isMobile ? 'lg' : 'xl'} />
              )}
              <div>
                <Title order={1} fw="600" fz={{base: 'h3', sm: 'h1'}}>
                  {customer.firstName} {customer.lastName}
                </Title>
                <Text c="dimmed" fw="500" fz="lg">
                  {customer.emailAddress?.emailAddress}
                </Text>
              </div>
            </Group>
          </Card>
        </Grid.Col>
        <Grid.Col span={{base: 12, sm: 6}}>
          {customer.tags.includes('business') ? (
            <Card component={Link} to="/account" p="md" bg="blue.1">
              <Flex justify="space-between" align="center">
                <Stack>
                  <Group gap="sm">
                    <IconParachute />
                    <Title order={4}>Konto</Title>
                  </Group>
                  <Text>Din personlig konto</Text>
                </Stack>
                <Button variant="default" color="blue">
                  Gå tilbage til konto
                </Button>
              </Flex>
            </Card>
          ) : null}
        </Grid.Col>
        <Grid.Col span={{base: 12, sm: 6}}>
          <Card
            component={Link}
            to="/business/public"
            withBorder
            bg={!status.profile ? 'red.1' : undefined}
            p={{base: 'sm', sm: 'xl'}}
          >
            <Stack>
              <Group gap="sm">
                <IconHeart />
                <Title order={4}>Profil</Title>
              </Group>
              <Text visibleFrom="sm">Opdater dine personlige oplysninger</Text>
            </Stack>
          </Card>
        </Grid.Col>
        <Grid.Col span={{base: 12, sm: 6}}>
          <Card
            component={Link}
            to="/business/locations"
            withBorder
            bg={!status.locations ? 'red.1' : undefined}
            p={{base: 'sm', sm: 'xl'}}
          >
            <Stack>
              <Group gap="sm">
                <IconGps />
                <Title order={4}>Lokationer</Title>
              </Group>
              <Text visibleFrom="sm">Administrer dine lokationer</Text>
            </Stack>
          </Card>
        </Grid.Col>
        <Grid.Col span={{base: 12, sm: 6}}>
          <Card
            component={Link}
            to="/business/schedules"
            withBorder
            bg={!status.schedules ? 'red.1' : undefined}
            p={{base: 'sm', sm: 'xl'}}
          >
            <Stack>
              <Group gap="sm">
                <IconClock />
                <Title order={4}>Vagtplan</Title>
              </Group>
              <Text visibleFrom="sm">Ændre din fornavn eller efternavn.</Text>
            </Stack>
          </Card>
        </Grid.Col>
        <Grid.Col span={{base: 12, sm: 6}}>
          <Card
            component={Link}
            to="/business/services"
            withBorder
            bg={!status.services ? 'red.1' : undefined}
            p={{base: 'sm', sm: 'xl'}}
          >
            <Stack>
              <Group gap="sm">
                <IconShoppingBag />
                <Title order={4}>Ydelser</Title>
              </Group>
              <Text visibleFrom="sm">Tilføj eller opdater dine ydelser.</Text>
            </Stack>
          </Card>
        </Grid.Col>
        <Grid.Col span={{base: 12, sm: 6}}>
          <Card
            component={Link}
            to="/business/bookings"
            withBorder
            p={{base: 'sm', sm: 'xl'}}
          >
            <Stack>
              <Group gap="sm">
                <IconBook />
                <Title order={4}>Kalendar</Title>
              </Group>
              <Text visibleFrom="sm">Administrer dine kunde bookinger</Text>
            </Stack>
          </Card>
        </Grid.Col>
        <Grid.Col span={{base: 12, sm: 6}}>
          <Card
            component={Link}
            to="/business/booked"
            withBorder
            p={{base: 'sm', sm: 'xl'}}
          >
            <Stack>
              <Group gap="sm">
                <IconPlane />
                <Title order={4}>Ferie</Title>
              </Group>
              <Text visibleFrom="sm">Planlæg og administrer dine ferier</Text>
            </Stack>
          </Card>
        </Grid.Col>
        <Grid.Col span={{base: 12, sm: 6}}>
          <Card
            component={Link}
            to="/business/payouts"
            withBorder
            p={{base: 'sm', sm: 'xl'}}
          >
            <Stack>
              <Group gap="sm">
                <IconCurrencyDollar />
                <Title order={4}>Udbetalinger</Title>
              </Group>
              <Text visibleFrom="sm">Administrer dine udbetalinger</Text>
            </Stack>
          </Card>
        </Grid.Col>
      </Grid>
      <Divider mt="xl" mb="md" />
      <Flex justify="flex-end">
        <Form method="POST" action="/account/logout">
          <AccountMenuLink
            item={{
              link: '#',
              label: 'Log ud',
              icon: IconLogout,
              isBusiness: true,
              data: 'logout-link',
              deactiveActive: true,
            }}
            onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
              e.preventDefault();
              const target = e.target as Element;
              const form = target.closest('form');
              if (form) {
                (form as HTMLFormElement).submit();
              }
            }}
          />
        </Form>
      </Flex>
    </Container>
  );
}
