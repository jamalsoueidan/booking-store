import {
  Avatar,
  Container,
  Divider,
  Group,
  Text,
  UnstyledButton,
} from '@mantine/core';
import {Form, Link, NavLink} from '@remix-run/react';
import {
  IconAddressBook,
  IconCalendarEvent,
  IconClock,
  IconFingerprint,
  IconHeartHandshake,
  IconHome,
  IconLocation,
  IconLogout,
  IconPhoto,
  IconPlaneDeparture,
  IconShoppingBag,
  IconUser,
} from '@tabler/icons-react';
import {useState} from 'react';
import {type CustomerQuery} from 'storefrontapi.generated';
import {type User} from '~/lib/api/model';
import classes from './AccountMenu.module.css';

const topMenu = [
  {
    link: '/account/public',
    label: 'Profile',
    icon: IconHeartHandshake,
    isBusiness: true,
  },
  {
    link: '/account/locations',
    label: 'Lokationer',
    icon: IconLocation,
    isBusiness: true,
  },
  {
    link: '/account/schedules',
    label: 'Vagtplan',
    icon: IconClock,
    isBusiness: true,
  },
  {
    link: '/account/services',
    label: 'Ydelser',
    icon: IconAddressBook,
    isBusiness: true,
  },
  {
    link: '/account/bookings',
    label: 'Bookinger',
    icon: IconCalendarEvent,
    isBusiness: true,
  },
  {
    link: '/account/booked',
    label: 'Ferie',
    icon: IconPlaneDeparture,
    isBusiness: true,
  },
];

const bottomMenu = [
  {
    link: '/account/dashboard',
    label: 'Forside',
    icon: IconHome,
  },
  {
    link: '/account/orders',
    label: 'Købshistorik',
    icon: IconShoppingBag,
  },
  {
    link: '/account/profile',
    label: 'Konto',
    icon: IconUser,
  },
  {link: '/account/addresses', label: 'Adresser', icon: IconAddressBook},
  {
    link: '/account/upload',
    label: 'Skift billed',
    icon: IconPhoto,
    isBusiness: true,
  },
  {
    link: '/account/password',
    label: 'Skift adgangskode',
    icon: IconFingerprint,
  },
];

export function AccountMenu({
  closeDrawer,
  customer,
  user,
  isBusiness,
}: {
  closeDrawer: () => void;
  customer: CustomerQuery['customer'];
  user?: User | null;
  isBusiness: boolean;
}) {
  const [active, setActive] = useState('Billing');

  const topLinks = topMenu
    .filter((item) => item.isBusiness === isBusiness || !item.isBusiness)
    .map((item) => (
      <NavLink
        className={classes.link}
        data-active={item.label === active || undefined}
        to={item.link}
        key={item.label}
        onClick={() => {
          closeDrawer();
          setActive(item.label);
        }}
      >
        <item.icon className={classes.linkIcon} stroke={1.5} />
        <Text>{item.label}</Text>
      </NavLink>
    ));

  const bottomLinks = bottomMenu
    .filter((item) => item.isBusiness === isBusiness || !item.isBusiness)
    .map((item) => (
      <NavLink
        className={classes.link}
        data-active={item.label === active || undefined}
        to={item.link}
        key={item.label}
        onClick={() => {
          closeDrawer();
          setActive(item.label);
        }}
      >
        <item.icon className={classes.linkIcon} stroke={1.5} />
        <span>{item.label}</span>
      </NavLink>
    ));

  return (
    <>
      <div className={classes.navbarMain}>
        <Container pt="sm">
          <Group maw="90%">
            {user && (
              <Avatar
                src={user.images?.profile?.url}
                radius="xl"
                component={Link}
                to="/account/upload"
              />
            )}
            <UnstyledButton
              style={{flex: 1}}
              component={Link}
              to={`/artist/${user?.username}`}
              target="_blank"
            >
              <Text size="sm" fw={500} c="black">
                {customer?.firstName} {customer?.lastName}
              </Text>

              <Text c="dimmed" size="xs">
                {customer?.email}
              </Text>
            </UnstyledButton>
          </Group>
        </Container>
        <Divider my="xs" />
        {isBusiness ? topLinks : bottomLinks}
      </div>
      <div className={classes.footer}>
        <Divider my="xs" />
        {isBusiness && bottomLinks}

        <Form method="POST" action="/account/logout">
          <UnstyledButton
            className={classes.link}
            type="submit"
            variant="subtle"
            style={{width: '100%'}}
            mb="sm"
          >
            <IconLogout className={classes.linkIcon} stroke={1.5} />
            <span>Log ud</span>
          </UnstyledButton>
        </Form>
      </div>
    </>
  );
}
