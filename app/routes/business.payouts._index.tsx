import {
  Badge,
  Button,
  Card,
  Container,
  rem,
  SimpleGrid,
  Skeleton,
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
import {AccountContent} from '~/components/account/AccountContent';
import {AccountTitle} from '~/components/account/AccountTitle';
import {getBookingShopifyApi} from '~/lib/api/bookingShopifyApi';
import type {
  CustomerPayoutAccountGetResponse,
  CustomerPayoutBalanceResponse,
} from '~/lib/api/model';
import {getCustomer} from '~/lib/get-customer';
import {isMobilePay} from './business.payouts';

export async function loader({context}: LoaderFunctionArgs) {
  const customerId = await getCustomer({context});
  const payoutAccount =
    getBookingShopifyApi().customerPayoutAccountGet(customerId);

  const payoutBalance =
    getBookingShopifyApi().customerPayoutBalance(customerId);

  const payouts = getBookingShopifyApi().customerPayoutPaginate(customerId, {
    page: '1',
  });

  return defer({payoutAccount, payoutBalance, payouts});
}

export default function AccountPayoutsIndex() {
  const data = useLoaderData<typeof loader>();

  return (
    <Container size="md" my={{base: rem(80), sm: rem(100)}}>
      <AccountTitle linkBack="/business" heading="Udbetalinger" />

      <AccountContent>
        <Stack gap="xl">
          <SimpleGrid cols={{base: 1, sm: 2}}>
            <PayoutAccount payoutAccount={data.payoutAccount} />
            <PayoutBalance payoutBalance={data.payoutBalance} />
          </SimpleGrid>

          <div>
            <Title order={3}>Historik</Title>
            <Text c="dimmed">Listen af alle udbetalinger der er foretagt</Text>
          </div>

          <Suspense fallback={<>Henter udbetalingshistorik...</>}>
            <Await resolve={data.payouts}>
              {({payload}) => {
                return (
                  <Table.ScrollContainer minWidth={500}>
                    <Table>
                      <Table.Thead>
                        <Table.Tr>
                          <Table.Th>Dato</Table.Th>
                          <Table.Th>Status</Table.Th>
                          <Table.Th>Beløb</Table.Th>
                          <Table.Th align="right"></Table.Th>
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
                              <Table.Td align="right">
                                <Button
                                  variant="default"
                                  size="sm"
                                  component={Link}
                                  to={`${payout._id}`}
                                >
                                  Vis detailjer
                                </Button>
                              </Table.Td>
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
      </AccountContent>
    </Container>
  );
}

const PayoutBalance = ({
  payoutBalance,
}: {
  payoutBalance: Promise<CustomerPayoutBalanceResponse>;
}) => {
  return (
    <Suspense fallback={<Skeleton height="100%" width="100%" />}>
      <Await resolve={payoutBalance}>
        {({payload}) => {
          return (
            <Card withBorder component={Stack} gap="xs" align="flex-start">
              <Title order={3}>Balance</Title>
              <Text>Total: {payload.totalAmount} DKK</Text>
              <Text>Kørsel: {payload.totalShippingAmount} DKK</Text>
              <Text>Behandlinger: {payload.totalLineItems} antal</Text>
              {payload.totalAmount > 0 ? (
                <Form method="post" action="request">
                  <Button type="submit" variant="light">
                    Send anmodning
                  </Button>
                </Form>
              ) : null}
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
    <Suspense fallback={<Skeleton height="100%" width="100%" />}>
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
