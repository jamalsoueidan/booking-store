import {
  Badge,
  Button,
  Card,
  SimpleGrid,
  Stack,
  Table,
  Text,
  Title,
} from '@mantine/core';
import {Form, Link, useLoaderData} from '@remix-run/react';
import {json, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {format} from 'date-fns';
import {da} from 'date-fns/locale';
import {getBookingShopifyApi} from '~/lib/api/bookingShopifyApi';
import {getCustomer} from '~/lib/get-customer';
import {isMobilePay} from './($locale).account.payouts';

export async function loader({context}: LoaderFunctionArgs) {
  const customer = await getCustomer({context});
  const {payload} = await getBookingShopifyApi().customerPayoutAccountGet(
    customer.id,
  );

  return json({payoutAccount: payload});
}

const elements = [
  {position: 6, mass: 12.011, symbol: 'C', name: 'Carbon'},
  {position: 7, mass: 14.007, symbol: 'N', name: 'Nitrogen'},
  {position: 39, mass: 88.906, symbol: 'Y', name: 'Yttrium'},
  {position: 56, mass: 137.33, symbol: 'Ba', name: 'Barium'},
  {position: 58, mass: 140.12, symbol: 'Ce', name: 'Cerium'},
];

export default function AccountPayoutsIndex() {
  const data = useLoaderData<typeof loader>();
  const rows = elements.map((element) => (
    <Table.Tr key={element.name}>
      <Table.Td>{format(new Date(), 'yyyy-MM-dd', {locale: da})}</Table.Td>
      <Table.Td>
        <Badge color="green">Overført</Badge>
      </Table.Td>
      <Table.Td>0.00 DKK</Table.Td>
    </Table.Tr>
  ));

  return (
    <Stack>
      <SimpleGrid cols={{base: 1, sm: 2, md: 3}}>
        <Card withBorder>
          <Stack gap="xs">
            {data.payoutAccount ? (
              <>
                {isMobilePay(data.payoutAccount.payoutDetails) ? (
                  <>
                    <Title order={5}>MobilePay overførsel</Title>
                    <Text>{data.payoutAccount.payoutDetails.phoneNumber}</Text>
                  </>
                ) : (
                  <>
                    <Title order={5}>Bank overførsel</Title>
                    <Text>{data.payoutAccount.payoutDetails.bankName}</Text>
                    <Text>
                      {data.payoutAccount.payoutDetails.regNum} /{' '}
                      {data.payoutAccount.payoutDetails.accountNum}
                    </Text>
                  </>
                )}
                <Form method="post" action="destroy">
                  <Button type="submit" variant="light" color="red">
                    Slet
                  </Button>
                </Form>
              </>
            ) : (
              <>
                <Text>
                  For at kunne modtag betaling, skal du vælge overførselsmetode
                  du ønsker
                </Text>
                <Button
                  component={Link}
                  to="create"
                  variant="light"
                  color="red"
                >
                  Opret en betalingskonto
                </Button>
              </>
            )}
          </Stack>
        </Card>
      </SimpleGrid>

      <div>
        <Title order={3}>Historik</Title>
        <Text c="dimmed">Listen af alle udbetalinger der er foretagt</Text>
      </div>

      <Table.ScrollContainer minWidth={500} type="native">
        <Table>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Dato</Table.Th>
              <Table.Th>Status</Table.Th>
              <Table.Th>Beløb</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{rows}</Table.Tbody>
        </Table>
      </Table.ScrollContainer>
    </Stack>
  );
}
