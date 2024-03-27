import {Badge, Stack, Table, Text, Title} from '@mantine/core';
import {json, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {format} from 'date-fns';
import {da} from 'date-fns/locale';
import {getCustomer} from '~/lib/get-customer';

export async function loader({context}: LoaderFunctionArgs) {
  const customer = await getCustomer({context});
  return json({});
}

const elements = [
  {position: 6, mass: 12.011, symbol: 'C', name: 'Carbon'},
  {position: 7, mass: 14.007, symbol: 'N', name: 'Nitrogen'},
  {position: 39, mass: 88.906, symbol: 'Y', name: 'Yttrium'},
  {position: 56, mass: 137.33, symbol: 'Ba', name: 'Barium'},
  {position: 58, mass: 140.12, symbol: 'Ce', name: 'Cerium'},
];

export default function AccountPayoutsIndex() {
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
