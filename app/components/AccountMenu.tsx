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
  IconBasket,
  IconFingerprint,
  IconLocation,
  IconLogout,
  IconMeeple,
  IconPhoneCall,
  IconPhoto,
  IconSocial,
  IconUser,
} from '@tabler/icons-react';
import {useState} from 'react';
import {type CustomerQuery} from 'storefrontapi.generated';
import {type User} from '~/lib/api/model';
import classes from './AccountMenu.module.css';

const topMenu = [
  {link: '/account/locations', label: 'Lokationer', icon: IconLocation},
  {link: '/account/schedules', label: 'Vagtplan', icon: IconMeeple},
  {link: '/account/services', label: 'Ydelser', icon: IconBasket},
  {link: '/account/bookings', label: 'Reservationer', icon: IconPhoneCall},
  {link: '/account/orders', label: 'Bestillinger', icon: IconPhoneCall},
];

const bottomMenu = [
  {link: '/account/public', label: 'Profile', icon: IconSocial},
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
  user: User;
  isBusiness: boolean;
}) {
  const [active, setActive] = useState('Billing');

  const topLinks = topMenu.map((item) => (
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

  const bottomLinks = bottomMenu.map((item) => (
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
          <Link to="/account">
            <Group>
              <Avatar src={user.images?.profile?.url} radius="xl" />

              <div style={{flex: 1}}>
                <Text size="sm" fw={500}>
                  {customer?.firstName} {customer?.lastName}
                </Text>

                <Text c="dimmed" size="xs">
                  {customer?.email}
                </Text>
              </div>
            </Group>
          </Link>
        </Container>
        <Divider my="xs" />
        {topLinks}
      </div>
      <div className={classes.footer}>
        <Divider my="xs" />
        {bottomLinks}

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
