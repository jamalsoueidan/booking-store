import {Group, UnstyledButton} from '@mantine/core';
import {Form, NavLink} from '@remix-run/react';
import {Customer} from '@shopify/hydrogen/storefront-api-types';
import {
  Icon2fa,
  IconAddressBook,
  IconBrandPaypal,
  IconFingerprint,
  IconLocation,
  IconLogout,
  IconReceipt2,
  IconSettings,
  IconUser,
} from '@tabler/icons-react';
import {useState} from 'react';
import classes from './AccountMenu.module.css';

const data = [
  {link: '/account/locations', label: 'Lokationer', icon: IconLocation},
  {link: '/account/orders', label: 'Ordrer', icon: IconBrandPaypal},
  {link: '/account/public', label: 'Profile', icon: IconUser},
  {
    link: '/account/profile',
    label: 'Personlige oplysninger',
    icon: IconReceipt2,
  },
  {link: '/account/addresses', label: 'Adresser', icon: IconAddressBook},
  {link: '', label: 'Authentication', icon: Icon2fa},
  {link: '', label: 'Other Settings', icon: IconSettings},
];

export function AccountMenu({
  closeDrawer,
  customer,
}: {
  closeDrawer: () => void;
  customer: Pick<Customer, 'firstName' | 'lastName'>;
}) {
  const [active, setActive] = useState('Billing');

  const links = data.map((item) => (
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
        <Group className={classes.header} justify="space-between">
          {customer.firstName} {customer.lastName}
        </Group>
        {links}
      </div>
      <div className={classes.footer}>
        <NavLink
          to="/account/password"
          data-active={'Skift adgangskode' === active || undefined}
          className={classes.link}
          onClick={() => {
            closeDrawer();
            setActive('Skift adgangskode');
          }}
        >
          <IconFingerprint className={classes.linkIcon} stroke={1.5} />
          <span>Skift adgangskode</span>
        </NavLink>

        <Form method="POST" action="/account/logout">
          <UnstyledButton
            className={classes.link}
            type="submit"
            variant="subtle"
            style={{width: '100%'}}
          >
            <IconLogout className={classes.linkIcon} stroke={1.5} />
            <span>Log ud</span>
          </UnstyledButton>
        </Form>
      </div>
    </>
  );
}
