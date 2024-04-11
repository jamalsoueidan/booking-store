import {Card, Stack, Table, Text} from '@mantine/core';
import {defer, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {getCustomer} from '~/lib/get-customer';

import {Await, useLoaderData} from '@remix-run/react';

import {format} from 'date-fns';
import {da} from 'date-fns/locale';
import {Suspense} from 'react';
import {AccountContent} from '~/components/account/AccountContent';
import {AccountTitle} from '~/components/account/AccountTitle';
import {getBookingShopifyApi} from '~/lib/api/bookingShopifyApi';
import type {
  CustomerPayoutGetResponse,
  CustomerPayoutLogReferenceDocument,
  CustomerPayoutLogResponse,
  Shipping,
} from '~/lib/api/model';
import {isMobilePay} from './account.payouts';

export function isShipping(
  details: CustomerPayoutLogReferenceDocument,
): details is Shipping {
  return (details as Shipping).cost !== undefined;
}

export async function loader({context, params}: LoaderFunctionArgs) {
  const customerId = await getCustomer({context});
  const {id} = params;

  const payout = getBookingShopifyApi().customerPayoutGet(customerId, id || '');

  const payoutLogs = getBookingShopifyApi().customerPayoutLogPaginate(
    customerId,
    id || '',
    {
      page: '1',
    },
  );

  return defer({payout, payoutLogs});
}

export default function AccountPayoutsId() {
  const data = useLoaderData<typeof loader>();

  return (
    <>
      <AccountTitle linkBack="../" heading="Visning af udbetaling" />

      <AccountContent>
        <Stack align="flex-start">
          <Payout data={data.payout} />
          <PayoutLogs data={data.payoutLogs} />
        </Stack>
      </AccountContent>
    </>
  );
}

const PayoutLogs = ({data}: {data: Promise<CustomerPayoutLogResponse>}) => {
  return (
    <Suspense fallback={<>Vent et øjeblik</>}>
      <Await resolve={data}>
        {({payload}) => {
          return (
            <Table>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>#</Table.Th>
                  <Table.Th>Type</Table.Th>
                  <Table.Th>Title</Table.Th>
                  <Table.Th>Beløb</Table.Th>
                  <Table.Th>Dato</Table.Th>
                </Table.Tr>
              </Table.Thead>

              {payload.totalCount > 0 ? (
                <Table.Tbody>
                  {payload.results.map((payout, index) => {
                    return (
                      <Table.Tr key={payout._id}>
                        <Table.Td>Vis order</Table.Td>
                        {isShipping(payout.referenceDocument) ? (
                          <>
                            <Table.Td>Forsendelse</Table.Td>
                            <Table.Td>
                              {payout.referenceDocument.origin.name} -{' '}
                              {payout.referenceDocument.destination.name}
                            </Table.Td>
                            <Table.Td>
                              {payout.referenceDocument.cost.value} DKK
                            </Table.Td>
                          </>
                        ) : (
                          <>
                            <Table.Td>Behandlinger</Table.Td>
                            <Table.Td>
                              {payout.referenceDocument.title}
                            </Table.Td>
                            <Table.Td>
                              {payout.referenceDocument.price} DKK
                            </Table.Td>
                          </>
                        )}
                        <Table.Td>
                          {format(new Date(payout.orderCreatedAt), 'PPPP', {
                            locale: da,
                          })}
                        </Table.Td>
                      </Table.Tr>
                    );
                  })}
                </Table.Tbody>
              ) : (
                <Table.Tbody>
                  <Table.Tr>
                    <Table.Td colSpan={4}>Der er sket en fejl!</Table.Td>
                  </Table.Tr>
                </Table.Tbody>
              )}
            </Table>
          );
        }}
      </Await>
    </Suspense>
  );
};

const Payout = ({data}: {data: Promise<CustomerPayoutGetResponse>}) => {
  return (
    <Suspense fallback={<>asd</>}>
      <Await resolve={data}>
        {({payload}) => {
          return (
            <Card withBorder>
              <Stack gap="xs">
                <Text>
                  Total: {payload.amount} {payload.currencyCode}
                </Text>
                <Text>Dato: {payload.date.toString()}</Text>
                <Text>Betalingsmetode: {payload.payoutType}</Text>
                {payload.payoutDetails ? (
                  <>
                    {isMobilePay(payload.payoutDetails) ? (
                      <>
                        <Text>
                          MobilePay: {payload.payoutDetails.phoneNumber}
                        </Text>
                      </>
                    ) : (
                      <>
                        <Text>
                          Bank overførsel: {payload.payoutDetails.bankName}
                        </Text>
                        <Text>
                          {payload.payoutDetails.regNum} /{' '}
                          {payload.payoutDetails.accountNum}
                        </Text>
                      </>
                    )}
                  </>
                ) : null}
              </Stack>
            </Card>
          );
        }}
      </Await>
    </Suspense>
  );
};
