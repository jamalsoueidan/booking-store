import {Button, Container, Group, rem} from '@mantine/core';
import {useOutletContext, useParams, type MetaFunction} from '@remix-run/react';
import {parseGid} from '@shopify/hydrogen';
import type {CustomerAddressInput} from '@shopify/hydrogen/customer-account-api-types';
import {
  json,
  redirect,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
} from '@shopify/remix-oxygen';
import type {
  AddressFragment,
  CustomerFragment,
} from 'customer-accountapi.generated';
import {useTranslation} from 'react-i18next';
import {AccountContent} from '~/components/account/AccountContent';
import {AccountTitle} from '~/components/account/AccountTitle';
import {
  DELETE_ADDRESS_MUTATION,
  UPDATE_ADDRESS_MUTATION,
} from '~/graphql/customer-account/CustomerAddressMutations';
import {AddressForm} from './account.addresses.create';

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

export async function action({request, context}: ActionFunctionArgs) {
  const {customerAccount} = context;

  try {
    const form = await request.formData();

    const addressId = form.has('addressId')
      ? String(form.get('addressId'))
      : null;
    if (!addressId) {
      throw new Error('You must provide an address id.');
    }

    // this will ensure redirecting to login never happen for mutatation
    const isLoggedIn = await customerAccount.isLoggedIn();
    if (!isLoggedIn) {
      return json(
        {error: {[addressId]: 'Unauthorized'}},
        {
          status: 401,
          headers: {
            'Set-Cookie': await context.session.commit(),
          },
        },
      );
    }

    const defaultAddress = form.has('defaultAddress')
      ? String(form.get('defaultAddress')) === 'on'
      : false;
    const address: CustomerAddressInput = {};
    const keys: (keyof CustomerAddressInput)[] = [
      'address1',
      'address2',
      'city',
      'company',
      'territoryCode',
      'firstName',
      'lastName',
      'phoneNumber',
      'zoneCode',
      'zip',
    ];

    for (const key of keys) {
      const value = form.get(key);
      if (typeof value === 'string') {
        address[key] = value;
      }
    }

    switch (request.method) {
      case 'PUT': {
        // handle address updates
        try {
          const {data, errors} = await customerAccount.mutate(
            UPDATE_ADDRESS_MUTATION,
            {
              variables: {
                address,
                addressId: decodeURIComponent(addressId),
                defaultAddress,
              },
            },
          );

          if (errors?.length) {
            throw new Error(errors[0].message);
          }

          if (data?.customerAddressUpdate?.userErrors?.length) {
            throw new Error(data?.customerAddressUpdate?.userErrors[0].message);
          }

          if (!data?.customerAddressUpdate?.customerAddress) {
            throw new Error('Customer address update failed.');
          }

          return json(
            {
              error: null,
              updatedAddress: address,
              defaultAddress,
            },
            {
              headers: {
                'Set-Cookie': await context.session.commit(),
              },
            },
          );
        } catch (error: unknown) {
          if (error instanceof Error) {
            return json(
              {error: {[addressId]: error.message}},
              {
                status: 400,
                headers: {
                  'Set-Cookie': await context.session.commit(),
                },
              },
            );
          }
          return json(
            {error: {[addressId]: error}},
            {
              status: 400,
              headers: {
                'Set-Cookie': await context.session.commit(),
              },
            },
          );
        }
      }

      case 'DELETE': {
        // handles address deletion
        try {
          const {data, errors} = await customerAccount.mutate(
            DELETE_ADDRESS_MUTATION,
            {
              variables: {addressId: decodeURIComponent(addressId)},
            },
          );

          if (errors?.length) {
            throw new Error(errors[0].message);
          }

          if (data?.customerAddressDelete?.userErrors?.length) {
            throw new Error(data?.customerAddressDelete?.userErrors[0].message);
          }

          if (!data?.customerAddressDelete?.deletedAddressId) {
            throw new Error('Customer address delete failed.');
          }

          return redirect('/account/addresses');
        } catch (error: unknown) {
          if (error instanceof Error) {
            return json(
              {error: {[addressId]: error.message}},
              {
                status: 400,
                headers: {
                  'Set-Cookie': await context.session.commit(),
                },
              },
            );
          }
          return json(
            {error: {[addressId]: error}},
            {
              status: 400,
              headers: {
                'Set-Cookie': await context.session.commit(),
              },
            },
          );
        }
      }

      default: {
        return json(
          {error: {[addressId]: 'Method not allowed'}},
          {
            status: 405,
            headers: {
              'Set-Cookie': await context.session.commit(),
            },
          },
        );
      }
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      return json(
        {error: error.message},
        {
          status: 400,
          headers: {
            'Set-Cookie': await context.session.commit(),
          },
        },
      );
    }
    return json(
      {error},
      {
        status: 400,
        headers: {
          'Set-Cookie': await context.session.commit(),
        },
      },
    );
  }
}

export default function Addresses() {
  const {t} = useTranslation(['account'], {keyPrefix: 'address'});
  const {customer} = useOutletContext<{customer: CustomerFragment}>();
  const {defaultAddress, addresses} = customer;
  const {id} = useParams();

  const address = addresses.nodes.find((a) => id === parseGid(a.id).id);

  if (!address) {
    return null;
  }

  return (
    <Container size="md" my={{base: rem(80), sm: rem(100)}}>
      <AccountTitle linkBack="/account/addresses" heading={t('edit')} />
      <AccountContent>
        <AddressForm
          key={address.id}
          addressId={address.id}
          address={address}
          defaultAddress={defaultAddress}
        >
          {({stateForMethod}) => (
            <Group>
              <Button
                disabled={stateForMethod('PUT') !== 'idle'}
                formMethod="PUT"
                type="submit"
              >
                {stateForMethod('PUT') !== 'idle' ? t('saving') : t('save')}
              </Button>
              <Button
                disabled={stateForMethod('DELETE') !== 'idle'}
                formMethod="DELETE"
                type="submit"
              >
                {stateForMethod('DELETE') !== 'idle'
                  ? t('deleting')
                  : t('delete')}
              </Button>
            </Group>
          )}
        </AddressForm>
      </AccountContent>
    </Container>
  );
}
