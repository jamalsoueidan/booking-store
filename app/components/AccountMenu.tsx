import {Group, UnstyledButton} from '@mantine/core';
import {Form, NavLink} from '@remix-run/react';
import {
  Icon2fa,
  IconAddressBook,
  IconBrandPaypal,
  IconFingerprint,
  IconLocation,
  IconLogout,
  IconReceipt2,
  IconSettings,
  IconSwitchHorizontal,
  IconUser,
} from '@tabler/icons-react';
import {useState} from 'react';
import classes from './AccountMenu.module.css';

const data = [
  {link: '/account/locations', label: 'Lokationer', icon: IconLocation},
  {link: '/account/orders', label: 'Orders', icon: IconBrandPaypal},
  {
    link: '/account/profile',
    label: 'Personalige oplysninger',
    icon: IconReceipt2,
  },
  {
    link: '/account/password',
    label: 'Skift adgangskode',
    icon: IconFingerprint,
  },
  {link: '/account/addresses', label: 'Addresses', icon: IconAddressBook},
  {link: '/account/public', label: 'Profile', icon: IconUser},
  {link: '', label: 'Authentication', icon: Icon2fa},
  {link: '', label: 'Other Settings', icon: IconSettings},
];

export function AccountMenu({closeDrawer}: {closeDrawer: () => void}) {
  const [active, setActive] = useState('Billing');

  const links = data.map((item) => (
    <NavLink
      className={classes.link}
      data-active={item.label === active || undefined}
      to={item.link}
      key={item.label}
      onClick={(event) => {
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
          Konto
        </Group>
        {links}
      </div>
      <div className={classes.footer}>
        <NavLink
          to="#"
          className={classes.link}
          onClick={(event) => {
            event.preventDefault();
            closeDrawer();
          }}
        >
          <IconSwitchHorizontal className={classes.linkIcon} stroke={1.5} />
          <span>Change account</span>
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
