import {Container, Divider, Title, UnstyledButton} from '@mantine/core';
import {Form, NavLink} from '@remix-run/react';
import {type Customer} from '@shopify/hydrogen/storefront-api-types';
import {
  IconAddressBook,
  IconBasket,
  IconFingerprint,
  IconLocation,
  IconLogout,
  IconMeeple,
  IconPhoneCall,
  IconReceipt2,
  IconUser,
} from '@tabler/icons-react';
import {useState} from 'react';
import classes from './AccountMenu.module.css';

const topMenu = [
  {link: '/account/locations', label: 'Lokationer', icon: IconLocation},
  {link: '/account/locations', label: 'Ydelser', icon: IconBasket},
  {link: '/account/locations', label: 'Vagtplan', icon: IconMeeple},
  {link: '/account/orders', label: 'Ordrer', icon: IconPhoneCall},
];

const bottomMenu = [
  {link: '/account/public', label: 'Profile', icon: IconUser},
  {
    link: '/account/profile',
    label: 'Konto',
    icon: IconReceipt2,
  },
  {link: '/account/addresses', label: 'Adresser', icon: IconAddressBook},
  {
    link: '/account/password',
    label: 'Skift adgangskode',
    icon: IconFingerprint,
  },
];

export function AccountMenu({
  closeDrawer,
  customer,
}: {
  closeDrawer: () => void;
  customer: Pick<Customer, 'firstName' | 'lastName'>;
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
          <Title order={4}>
            {customer.firstName} {customer.lastName}
          </Title>
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
