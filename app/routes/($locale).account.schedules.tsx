import {Button, Divider, Flex, Group, Title} from '@mantine/core';
import {useDisclosure} from '@mantine/hooks';
import {Link, Outlet, useLoaderData, useLocation} from '@remix-run/react';
import {type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import MobileModal from '~/components/MobileModal';
import {getBookingShopifyApi} from '~/lib/api/bookingShopifyApi';
import {getCustomer} from '~/lib/get-customer';
import AccountSchedulesCreate from './($locale).account.schedules.create';

export async function loader({context}: LoaderFunctionArgs) {
  const customer = await getCustomer({context});
  const response = await getBookingShopifyApi().customerScheduleList(
    customer.id,
  );

  return response.payload;
}

export default function AccountSchedulesIndex() {
  const loaderData = useLoaderData<typeof loader>();
  const location = useLocation();
  const [opened, {open, close}] = useDisclosure(false);

  return (
    <>
      <Title>Vagtplaner</Title>
      <Group mt="md">
        <Button onClick={open} radius="xl" size="md">
          Opret ny vagtplan
        </Button>
      </Group>
      <Divider my="md" />
      <Flex gap="xs">
        {loaderData.map((d) => (
          <Button
            key={d._id}
            component={Link}
            variant={location.pathname.includes(d._id) ? 'light' : 'outline'}
            size="xs"
            to={d._id}
          >
            {d.name}
          </Button>
        ))}
      </Flex>
      <Outlet key={location.pathname} />

      <MobileModal opened={opened} onClose={close} title="Opret vagtplan">
        <AccountSchedulesCreate close={close} />
      </MobileModal>
    </>
  );
}
