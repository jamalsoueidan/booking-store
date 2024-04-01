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
import {Await, Form, Link, useLoaderData} from '@remix-run/react';
import {defer, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {format} from 'date-fns';
import {da} from 'date-fns/locale';
import {Suspense} from 'react';
import {getBookingShopifyApi} from '~/lib/api/bookingShopifyApi';
import type {
  CustomerPayoutAccountGetResponse,
  CustomerPayoutBalanceResponse,
} from '~/lib/api/model';
import {getCustomer} from '~/lib/get-customer';
import {isMobilePay} from './($locale).account.payouts';

export async function loader({context}: LoaderFunctionArgs) {
  const customer = await getCustomer({context});
  const payoutAccount = getBookingShopifyApi().customerPayoutAccountGet(
    customer.id,
  );

  const payoutBalance = getBookingShopifyApi().customerPayoutBalance(
    customer.id,
  );

  const payouts = getBookingShopifyApi().customerPayoutPaginate(customer.id, {
    page: '1',
  });

  return defer({payoutAccount, payoutBalance, payouts});
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

  return (
    <Stack>
      <SimpleGrid cols={{base: 1, sm: 2, md: 3}}>
        <PayoutAccount payoutAccount={data.payoutAccount} />
        <PayoutBalance payoutBalance={data.payoutBalance} />
      </SimpleGrid>

      <div>
        <Title order={3}>Historik</Title>
        <Text c="dimmed">Listen af alle udbetalinger der er foretagt</Text>
      </div>

      <Suspense fallback={<>asd</>}>
        <Await resolve={data.payouts}>
          {({payload}) => {
            return (
              <Table.ScrollContainer minWidth={500} type="native">
                <Table>
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th>Dato</Table.Th>
                      <Table.Th>Status</Table.Th>
                      <Table.Th>Beløb</Table.Th>
                    </Table.Tr>
                  </Table.Thead>

                  {payload.totalCount > 0 ? (
                    <Table.Tbody>
                      {payload.results.map((payout) => (
                        <Table.Tr key={payout.date}>
                          <Table.Td>
                            {format(new Date(), 'yyyy-MM-dd', {locale: da})}
                          </Table.Td>
                          <Table.Td>
                            <Badge color="green">{payout.status}</Badge>
                          </Table.Td>
                          <Table.Td>{payout.amount} DKK</Table.Td>
                        </Table.Tr>
                      ))}
                    </Table.Tbody>
                  ) : (
                    <Table.Tbody>
                      <Table.Tr>
                        <Table.Td colSpan={4}>
                          Der er ikke oprettet udbetalinger endnu!
                        </Table.Td>
                      </Table.Tr>
                    </Table.Tbody>
                  )}
                </Table>
              </Table.ScrollContainer>
            );
          }}
        </Await>
      </Suspense>
    </Stack>
  );
}

const PayoutBalance = ({
  payoutBalance,
}: {
  payoutBalance: Promise<CustomerPayoutBalanceResponse>;
}) => {
  return (
    <Suspense fallback={<>asd</>}>
      <Await resolve={payoutBalance}>
        {({payload}) => {
          return (
            <Card withBorder>
              <Stack gap="xs">
                <Title order={3}>Balance</Title>
                <Text>DKK {payload.totalAmount}</Text>
              </Stack>
            </Card>
          );
        }}
      </Await>
    </Suspense>
  );
};

const PayoutAccount = ({
  payoutAccount,
}: {
  payoutAccount: Promise<CustomerPayoutAccountGetResponse>;
}) => {
  return (
    <Suspense fallback={<>asd</>}>
      <Await resolve={payoutAccount}>
        {({payload}) => {
          return (
            <Card withBorder>
              <Stack gap="xs" align="flex-start">
                {payload ? (
                  <>
                    {isMobilePay(payload.payoutDetails) ? (
                      <>
                        <Title order={3}>MobilePay overførsel</Title>
                        <Text>{payload.payoutDetails.phoneNumber}</Text>
                      </>
                    ) : (
                      <>
                        <Title order={3}>Bank overførsel</Title>
                        <Text>{payload.payoutDetails.bankName}</Text>
                        <Text>
                          {payload.payoutDetails.regNum} /{' '}
                          {payload.payoutDetails.accountNum}
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
                    <Title order={3}>Overførselsmetode</Title>
                    <Text>Du har ikke valgt en overførselsmetode.</Text>
                    <Button component={Link} to="create" variant="light">
                      Vælge en overførselsmetode
                    </Button>
                  </>
                )}
              </Stack>
            </Card>
          );
        }}
      </Await>
    </Suspense>
  );
};
