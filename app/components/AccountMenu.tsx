// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable jsx-a11y/anchor-has-content */
import {
  ActionIcon,
  AppShell,
  Avatar,
  Burger,
  Divider,
  Flex,
  NavLink,
  ScrollArea,
  Stack,
  Text,
  UnstyledButton,
} from '@mantine/core';
import {Form, Link, NavLink as RemixNavLink} from '@remix-run/react';
import {
  IconAddressBook,
  IconCalendarEvent,
  IconClock,
  IconCurrencyDollar,
  IconEye,
  IconHeartHandshake,
  IconHome,
  IconLocation,
  IconLogout,
  IconPhoto,
  IconPlaneDeparture,
  IconShoppingBag,
  IconUser,
} from '@tabler/icons-react';
import {type CustomerFragment} from 'customer-accountapi.generated';
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
];

export function AccountMenu({
  closeDrawer,
  customer,
  user,
  isBusiness = false,
  opened,
}: {
  closeDrawer: () => void;
  customer: CustomerFragment;
  user?: User | null;
  isBusiness?: boolean;
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
      <AppShell.Section grow component={ScrollArea}>
        <Flex justify="center" align="center" px="sm" pt="md" pb="4px" gap="xs">
          {user ? (
            <Avatar
              component={Link}
              to={`/account/upload`}
              size="sm"
              src={modifyImageUrl(user.images?.profile?.url, '50x50')}
              onClick={() => {
                setActive('');
                closeDrawer();
              }}
            />
          ) : (
            <Avatar
              size="sm"
              src=""
              onClick={() => {
                setActive('');
                closeDrawer();
              }}
            />
          )}

          <Stack gap="0" style={{flex: 1}}>
            <UnstyledButton
              fz="sm"
              component={Link}
              to="/account"
              onClick={() => {
                setActive('');
                closeDrawer();
              }}
            >
              <Text fz="sm">
                {customer?.firstName} {customer?.lastName}
              </Text>
            </UnstyledButton>
            {user ? (
              <Text c="dimmed" fz="xs">
                {user?.customerId}
              </Text>
            ) : null}
          </Stack>

          {user && user.isBusiness ? (
            <ActionIcon
              variant="default"
              component={Link}
              to={`/artist/${user?.username}`}
              target="_blank"
            >
              <IconEye />
            </ActionIcon>
          ) : null}
        </Flex>
        <Divider my="xs" />
        {isBusiness ? topLinks : null}
      </AppShell.Section>

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
    </>
  );
}
