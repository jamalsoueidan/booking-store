import {Button, Divider, Flex, Group, Modal, Title} from '@mantine/core';
import {useDisclosure, useMediaQuery} from '@mantine/hooks';
import {Link, Outlet, useLoaderData, useLocation} from '@remix-run/react';
import {type LoaderFunctionArgs} from '@shopify/remix-oxygen';
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
  const isMobile = useMediaQuery('(max-width: 50em)');

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

      <Modal
        opened={opened}
        fullScreen={isMobile}
        onClose={close}
        title="Opret vagtplan"
        centered
      >
        <AccountSchedulesCreate close={close} />
      </Modal>
    </>
  );
}
