import {Button, Modal, ScrollArea, Table} from '@mantine/core';
import {useMediaQuery} from '@mantine/hooks';
import {
  Form,
  Outlet,
  useLoaderData,
  useNavigate,
  useOutlet,
} from '@remix-run/react';

import {json, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {format, parseISO} from 'date-fns';
import {da} from 'date-fns/locale';
import {AccountButton} from '~/components/account/AccountButton';
import {AccountContent} from '~/components/account/AccountContent';
import {AccountTitle} from '~/components/account/AccountTitle';
import {getBookingShopifyApi} from '~/lib/api/bookingShopifyApi';
import {getCustomer} from '~/lib/get-customer';

export async function loader({context}: LoaderFunctionArgs) {
  const customerId = await getCustomer({context});

  const {payload: blocked} = await getBookingShopifyApi().customerBlockedList(
    customerId,
    {limit: '50'},
  );

  return json({blocked});
}

export default function AccountBookings() {
  const isMobile = useMediaQuery('(max-width: 62em)');
  const {blocked} = useLoaderData<typeof loader>();
  const inOutlet = !!useOutlet();
  const navigate = useNavigate();

  const closeModal = () => {
    navigate(-1);
  };

  const rows = blocked.results.map((row) => (
    <Table.Tr key={row._id}>
      <Table.Td w="30%">{row.title}</Table.Td>
      <Table.Td>
        {format(parseISO(row.start), 'PPPP', {locale: da})}
        <br />
        {format(parseISO(row.start), "'kl.' HH:mm", {locale: da})}
      </Table.Td>
      <Table.Td>
        {format(parseISO(row.end), 'PPPP', {locale: da})}
        <br />
        {format(parseISO(row.end), "'kl.' HH:mm", {locale: da})}
      </Table.Td>
      <Table.Td>
        <Form
          method="DELETE"
          action={`${row._id}/destroy`}
          style={{display: 'inline-block'}}
        >
          <Button variant="outline" color="red" size="xs" type="submit">
            Slet
          </Button>
        </Form>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <>
      <AccountTitle heading="Ferie">
        <AccountButton to={'create'}>Tilføj ferie</AccountButton>
      </AccountTitle>
      <AccountContent>
        <ScrollArea>
          <Table w="100%">
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Title</Table.Th>
                <Table.Th>Start tid</Table.Th>
                <Table.Th>Slut tid</Table.Th>
                <Table.Td></Table.Td>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>{rows}</Table.Tbody>
          </Table>
        </ScrollArea>
      </AccountContent>

      <Modal.Root
        opened={inOutlet}
        onClose={closeModal}
        fullScreen={isMobile}
        centered
      >
        <Modal.Overlay />
        <Modal.Content>
          <Outlet context={{closeModal}} />
        </Modal.Content>
      </Modal.Root>
    </>
  );
}
