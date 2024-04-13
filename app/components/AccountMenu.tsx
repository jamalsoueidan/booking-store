// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable jsx-a11y/anchor-has-content */
import {
  ActionIcon,
  AppShell,
  Avatar,
  Burger,
  Divider,
  NavLink,
  ScrollArea,
  UnstyledButton,
} from '@mantine/core';
import {Form, Link, NavLink as RemixNavLink} from '@remix-run/react';
import {
  IconAddressBook,
  IconCalendarEvent,
  IconClock,
  IconCurrencyDollar,
  IconEye,
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
import {type User} from '~/lib/api/model';
import {modifyImageUrl} from '~/lib/image';

export const topMenu = [
  {
    link: '/account/public',
    label: 'Profile',
    icon: IconHeartHandshake,
    isBusiness: true,
    data: 'public-link',
  },
  {
    link: '/account/locations',
    label: 'Lokationer',
    icon: IconLocation,
    isBusiness: true,
    data: 'locations-link',
  },
  {
    link: '/account/schedules',
    label: 'Vagtplan',
    icon: IconClock,
    isBusiness: true,
    data: 'schedules-link',
  },
  {
    link: '/account/services',
    label: 'Ydelser',
    icon: IconAddressBook,
    isBusiness: true,
    data: 'services-link',
  },
  {
    link: '/account/bookings',
    label: 'Kalendar',
    icon: IconCalendarEvent,
    isBusiness: true,
    data: 'calendar-link',
  },
  {
    link: '/account/booked',
    label: 'Ferie',
    icon: IconPlaneDeparture,
    isBusiness: true,
    data: 'booked-link',
  },
  {
    link: '/account/payouts',
    label: 'Udbetalinger',
    icon: IconCurrencyDollar,
    isBusiness: true,
    data: 'payouts-link',
  },
];

const bottomMenu = [
  {
    link: '/account/dashboard',
    label: 'Forside',
    icon: IconHome,
    data: 'dashboard-link',
  },
  {
    link: '/account/orders',
    label: 'Købshistorik',
    icon: IconShoppingBag,
    data: 'orders-link',
  },
  {
    link: '/account/profile',
    label: 'Konto',
    icon: IconUser,
    data: 'profile-link',
  },
  {link: '/account/addresses', label: 'Adresser', icon: IconAddressBook},
  {
    link: '/account/upload',
    label: 'Skift billed',
    icon: IconPhoto,
    isBusiness: true,
    data: 'change-upload-link',
  },
  {
    link: '/account/password',
    label: 'Skift adgangskode',
    icon: IconFingerprint,
    data: 'change-password-link',
  },
];

export function AccountMenu({
  closeDrawer,
  customer,
  user,
  isBusiness,
  opened,
}: {
  closeDrawer: () => void;
  customer: CustomerQuery['customer'];
  user?: User | null;
  isBusiness: boolean;
  opened: boolean;
}) {
  const [active, setActive] = useState('Billing');

  const topLinks = topMenu
    .filter((item) => item.isBusiness === isBusiness || !item.isBusiness)
    .map((item) => (
      <NavLink
        active={item.label === active || undefined}
        component={RemixNavLink}
        to={item.link}
        key={item.label}
        onClick={() => {
          closeDrawer();
          setActive(item.label);
        }}
        label={item.label}
        data-testid={item.data}
        leftSection={<item.icon stroke={1.5} />}
      />
    ));

  const bottomLinks = bottomMenu
    .filter((item) => item.isBusiness === isBusiness || !item.isBusiness)
    .map((item) => (
      <NavLink
        active={item.label === active || undefined}
        component={RemixNavLink}
        to={item.link}
        key={item.label}
        onClick={() => {
          closeDrawer();
          setActive(item.label);
        }}
        label={item.label}
        data-testid={item.data}
        leftSection={<item.icon stroke={1.5} />}
      />
    ));

  return (
    <>
      <AppShell.Section grow my="md" component={ScrollArea}>
        <NavLink
          label={
            <UnstyledButton
              fz="sm"
              component={Link}
              to="/account/"
              onClick={() => closeDrawer()}
            >
              {customer?.firstName} {customer?.lastName}
            </UnstyledButton>
          }
          description={
            <UnstyledButton
              fz="xs"
              component={Link}
              to="/account/"
              onClick={() => closeDrawer()}
            >
              {customer?.email && customer.email.length > 22
                ? customer?.email?.substring(0, 22) + '...'
                : customer?.email}
            </UnstyledButton>
          }
          leftSection={
            user ? (
              <Avatar
                component={Link}
                to={`/account/upload`}
                src={modifyImageUrl(user.images?.profile?.url, '50x50')}
                onClick={() => closeDrawer()}
              />
            ) : null
          }
          rightSection={
            user && user.isBusiness ? (
              <ActionIcon
                variant="default"
                component={Link}
                to={`/artist/${user?.username}`}
                target="_blank"
              >
                <IconEye />
              </ActionIcon>
            ) : null
          }
        />
        <Divider my="xs" />
        {isBusiness ? topLinks : bottomLinks}
      </AppShell.Section>
      {isBusiness ? (
        <AppShell.Section>
          <Divider my="xs" />
          {bottomLinks}

          <Form method="POST" action="/account/logout">
            <NavLink
              component={UnstyledButton}
              onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
                e.preventDefault();
                const target = e.target as Element;
                const form = target.closest('form');
                if (form) {
                  (form as HTMLFormElement).submit();
                }
              }}
              label="Log ud"
              data-testid="logout-link"
              leftSection={<IconLogout stroke={1.5} />}
            />
          </Form>
          <Divider />

          <NavLink
            onClick={closeDrawer}
            hiddenFrom="sm"
            rightSection={
              <Burger opened={opened} onClick={closeDrawer} size="md" />
            }
            data-testid="close-navigation-link"
          />
        </AppShell.Section>
      ) : null}
    </>
  );
}
