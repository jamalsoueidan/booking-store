import {
  Button,
  Card,
  Container,
  rem,
  SimpleGrid,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import {Link, useOutletContext, type MetaFunction} from '@remix-run/react';
import {parseGid} from '@shopify/hydrogen';
import {json, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {IconPlus} from '@tabler/icons-react';
import type {
  AddressFragment,
  CustomerFragment,
} from 'customer-accountapi.generated';
import {useTranslation} from 'react-i18next';
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
  const {t} = useTranslation(['account'], {keyPrefix: 'address'});
  const {customer} = useOutletContext<{customer: CustomerFragment}>();
  const {defaultAddress, addresses} = customer;

  return (
    <Container size="md" my={{base: rem(80), sm: rem(100)}}>
      <AccountTitle heading={t('title')} linkBack="/account/dashboard">
        <AccountButton
          to={'create'}
          leftSection={<IconPlus size={14} />}
          data-testid="create-button"
        >
          {t('create')}
        </AccountButton>
      </AccountTitle>
      <AccountContent>
        <ExistingAddresses
          addresses={addresses}
          defaultAddress={defaultAddress}
        />
      </AccountContent>
    </Container>
  );
}

function ExistingAddresses({
  addresses,
  defaultAddress,
}: Pick<CustomerFragment, 'addresses' | 'defaultAddress'>) {
  const {t} = useTranslation(['account'], {keyPrefix: 'address'});
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
            <Button>{t('edit')}</Button>
          </Stack>
        </Card>
      ))}
    </SimpleGrid>
  );
}
