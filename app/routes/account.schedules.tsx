import {Button, Flex, rem, ThemeIcon, Title} from '@mantine/core';
import {useDisclosure} from '@mantine/hooks';
import {Link, Outlet, useLoaderData, useLocation} from '@remix-run/react';
import {json, redirect, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {IconMoodSad} from '@tabler/icons-react';
import MobileModal from '~/components/MobileModal';
import {AccountButton} from '~/components/account/AccountButton';
import {AccountContent} from '~/components/account/AccountContent';
import {AccountTitle} from '~/components/account/AccountTitle';
import {getBookingShopifyApi} from '~/lib/api/bookingShopifyApi';
import {getCustomer} from '~/lib/get-customer';
import AccountSchedulesCreate from './account.schedules.create';

export async function loader({context, request}: LoaderFunctionArgs) {
  const customerId = await getCustomer({context});
  const response = await getBookingShopifyApi().customerScheduleList(
    customerId,
    context,
  );

  const url = new URL(request.url);
  if (url.pathname === '/account/schedules' && response.payload.length > 0) {
    return redirect(response.payload[0]._id);
  }
  return json(response.payload);
}

export default function AccountSchedulesIndex() {
  const loaderData = useLoaderData<typeof loader>();
  const location = useLocation();
  const [opened, {open, close}] = useDisclosure(false);

  return (
    <>
      <AccountTitle heading="Vagtplaner">
        {loaderData.length > 0 ? (
          <AccountButton onClick={open} data-testid="create-schedule-button">
            Opret ny vagtplan
          </AccountButton>
        ) : null}
      </AccountTitle>

      <AccountContent>
        {loaderData.length === 0 && !location.pathname.includes('create') ? (
          <Flex gap="lg" direction="column" justify="center" align="center">
            <ThemeIcon variant="white" size={rem(100)}>
              <IconMoodSad stroke={1} style={{width: '100%', height: '100%'}} />
            </ThemeIcon>
            <Title ta="center">Du har ingen vagtplaner</Title>
            <Button onClick={open} data-testid="empty-create-button">
              Tilføj vagtplan
            </Button>
          </Flex>
        ) : (
          <Flex gap="xs">
            {loaderData.map((d) => (
              <Button
                key={d._id}
                component={Link}
                variant={
                  location.pathname.includes(d._id) ? 'light' : 'outline'
                }
                size="sm"
                to={d._id}
              >
                {d.name}
              </Button>
            ))}
          </Flex>
        )}

        <Outlet key={location.pathname} />

        <MobileModal opened={opened} onClose={close} title="Opret vagtplan">
          <AccountSchedulesCreate close={close} />
        </MobileModal>
      </AccountContent>
    </>
  );
}
