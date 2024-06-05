import {Button, Card, SimpleGrid, Stack, Text, Title} from '@mantine/core';
import {Link, useOutletContext, type MetaFunction} from '@remix-run/react';
import {parseGid} from '@shopify/hydrogen';
import {json, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {IconPlus} from '@tabler/icons-react';
import type {
  AddressFragment,
  CustomerFragment,
} from 'customer-accountapi.generated';
import {AccountButton} from '~/components/account/AccountButton';
import {AccountContent} from '~/components/account/AccountContent';
import {AccountTitle} from '~/components/account/AccountTitle';

export type ActionResponse = {
  addressId?: string | null;
  createdAddress?: AddressFragment;
  defaultAddress?: string | null;
  deletedAddress?: string | null;
  error: Record<AddressFragment['id'], string> | null;
  updatedAddress?: AddressFragment;
};

export const meta: MetaFunction = () => {
  return [{title: 'Adresser'}];
};

export async function loader({context}: LoaderFunctionArgs) {
  await context.customerAccount.handleAuthStatus();

  return json(
    {},
    {
      headers: {
        'Set-Cookie': await context.session.commit(),
      },
    },
  );
}

export default function Addresses() {
  const {customer} = useOutletContext<{customer: CustomerFragment}>();
  const {defaultAddress, addresses} = customer;

  return (
    <>
      <AccountTitle heading="Adresser">
        <AccountButton
          to={'create'}
          leftSection={<IconPlus size={14} />}
          data-testid="create-button"
        >
          Opret adresse
        </AccountButton>
      </AccountTitle>
      <AccountContent>
        <ExistingAddresses
          addresses={addresses}
          defaultAddress={defaultAddress}
        />
      </AccountContent>
    </>
  );
}

function ExistingAddresses({
  addresses,
  defaultAddress,
}: Pick<CustomerFragment, 'addresses' | 'defaultAddress'>) {
  return (
    <SimpleGrid cols={{base: 1, sm: 3}}>
      {addresses.nodes.map((address) => (
        <Card
          key={address.id}
          component={Link}
          to={`${parseGid(address.id).id}/edit`}
          withBorder
        >
          <Stack gap="xs">
            <Title order={3}>{address.address1}</Title>
            <Text>
              {address.zip} {address.city}
            </Text>
            <Button>Ændre adresse</Button>
          </Stack>
        </Card>
      ))}
    </SimpleGrid>
  );
}
