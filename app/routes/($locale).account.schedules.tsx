import {Button, Flex, rem, ThemeIcon, Title} from '@mantine/core';
import {useDisclosure} from '@mantine/hooks';
import {Link, Outlet, useLoaderData, useLocation} from '@remix-run/react';
import {redirect, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {IconMoodSad} from '@tabler/icons-react';
import MobileModal from '~/components/MobileModal';
import {AccountButton} from '~/components/account/AccountButton';
import {AccountContent} from '~/components/account/AccountContent';
import {AccountTitle} from '~/components/account/AccountTitle';
import {getBookingShopifyApi} from '~/lib/api/bookingShopifyApi';
import {getCustomer} from '~/lib/get-customer';
import AccountSchedulesCreate from './($locale).account.schedules.create';

export async function loader({context, request}: LoaderFunctionArgs) {
  const customer = await getCustomer({context});
  const response = await getBookingShopifyApi().customerScheduleList(
    customer.id,
  );

  const url = new URL(request.url);
  if (url.pathname === '/account/schedules' && response.payload.length > 0) {
    return redirect(response.payload[0]._id);
  }
  return response.payload;
}

export default function AccountSchedulesIndex() {
  const loaderData = useLoaderData<typeof loader>();
  const location = useLocation();
  const [opened, {open, close}] = useDisclosure(false);

  return (
    <>
      <AccountTitle heading="Vagtplaner">
        <AccountButton onClick={open}>Opret ny vagtplan</AccountButton>
      </AccountTitle>

      <AccountContent>
        <Flex gap="xs">
          {loaderData.map((d) => (
            <Button
              key={d._id}
              component={Link}
              variant={location.pathname.includes(d._id) ? 'light' : 'outline'}
              size="sm"
              to={d._id}
            >
              {d.name}
            </Button>
          ))}
        </Flex>

        {loaderData.length === 0 ? (
          <Flex gap="lg" direction="column" justify="center" align="center">
            <ThemeIcon variant="white" size={rem(100)}>
              <IconMoodSad stroke={1} style={{width: '100%', height: '100%'}} />
            </ThemeIcon>
            <Title ta="center">Du har ingen vagtplaner</Title>
            <Button onClick={open}>Tilføj vagtplan</Button>
          </Flex>
        ) : null}

        <Outlet key={location.pathname} />

        <MobileModal opened={opened} onClose={close} title="Opret vagtplan">
          <AccountSchedulesCreate close={close} />
        </MobileModal>
      </AccountContent>
    </>
  );
}
