import {
  Button,
  Checkbox,
  Container,
  Group,
  rem,
  Stack,
  TextInput,
} from '@mantine/core';
import {
  Form,
  useActionData,
  useNavigation,
  type MetaFunction,
} from '@remix-run/react';
import type {CustomerAddressInput} from '@shopify/hydrogen/customer-account-api-types';
import {
  json,
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
import {CREATE_ADDRESS_MUTATION} from '~/graphql/customer-account/CustomerAddressMutations';

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
      case 'POST': {
        // handle new address creation
        try {
          const {data, errors} = await customerAccount.mutate(
            CREATE_ADDRESS_MUTATION,
            {
              variables: {address, defaultAddress},
            },
          );

          if (errors?.length) {
            throw new Error(errors[0].message);
          }

          if (data?.customerAddressCreate?.userErrors?.length) {
            throw new Error(data?.customerAddressCreate?.userErrors[0].message);
          }

          if (!data?.customerAddressCreate?.customerAddress) {
            throw new Error('Customer address create failed.');
          }

          return json(
            {
              error: null,
              createdAddress: data?.customerAddressCreate?.customerAddress,
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
  return (
    <Container size="md" my={{base: rem(80), sm: rem(100)}}>
      <AccountTitle linkBack="/account/addresses" heading={t('create')} />
      <AccountContent>
        <NewAddressForm />
      </AccountContent>
    </Container>
  );
}

function NewAddressForm() {
  const {t} = useTranslation(['account'], {keyPrefix: 'address'});

  const newAddress = {
    address1: '',
    address2: '',
    city: '',
    company: '',
    territoryCode: '',
    firstName: '',
    id: 'new',
    lastName: '',
    phoneNumber: '',
    zoneCode: '',
    zip: '',
  } as CustomerAddressInput;

  return (
    <AddressForm
      addressId={'NEW_ADDRESS_ID'}
      address={newAddress}
      defaultAddress={null}
    >
      {({stateForMethod}) => (
        <div>
          <Button
            disabled={stateForMethod('POST') !== 'idle'}
            formMethod="POST"
            type="submit"
          >
            {stateForMethod('POST') !== 'idle' ? t('creating') : t('create')}
          </Button>
        </div>
      )}
    </AddressForm>
  );
}

export function AddressForm({
  addressId,
  address,
  defaultAddress,
  children,
}: {
  addressId: AddressFragment['id'];
  address: CustomerAddressInput;
  defaultAddress: CustomerFragment['defaultAddress'];
  children: (props: {
    stateForMethod: (
      method: 'PUT' | 'POST' | 'DELETE',
    ) => ReturnType<typeof useNavigation>['state'];
  }) => React.ReactNode;
}) {
  const {t} = useTranslation(['account'], {keyPrefix: 'address.form'});
  const {state, formMethod} = useNavigation();
  const action = useActionData<ActionResponse>();
  const error = action?.error?.[addressId];
  const isDefaultAddress = defaultAddress?.id === addressId;
  return (
    <Form id={addressId}>
      <Stack>
        <input type="hidden" name="addressId" defaultValue={addressId} />
        <Group>
          <TextInput
            label={t('first_name')}
            aria-label={t('first_name')}
            autoComplete="given-name"
            defaultValue={address?.firstName ?? ''}
            id="firstName"
            name="firstName"
            placeholder={t('first_name')}
            required
            type="text"
          />
          <TextInput
            label={t('last_name')}
            aria-label={t('last_name')}
            autoComplete="family-name"
            defaultValue={address?.lastName ?? ''}
            id="lastName"
            name="lastName"
            placeholder={t('last_name')}
            required
            type="text"
          />
        </Group>
        <TextInput
          label={t('address')}
          aria-label={t('address')}
          autoComplete="adresse"
          defaultValue={address?.address1 ?? ''}
          id="address1"
          name="address1"
          placeholder={t('address')}
          required
          type="text"
        />
        <input
          aria-label="Address line 2"
          autoComplete="address-line2"
          defaultValue={address?.address2 ?? ''}
          id="address2"
          name="address2"
          placeholder="Address line 2"
          type="hidden"
        />
        <Group>
          <TextInput
            label={t('zip')}
            autoComplete="postal-code"
            defaultValue={address?.zip ?? ''}
            id="zip"
            name="zip"
            placeholder={t('zip')}
            required
            type="text"
          />
          <TextInput
            label={t('city')}
            aria-label={t('city')}
            autoComplete="address-level2"
            defaultValue={address?.city ?? ''}
            id="city"
            name="city"
            placeholder={t('city')}
            required
            type="text"
          />
        </Group>
        <input
          autoComplete="address-level1"
          defaultValue={address?.zoneCode ?? ''}
          id="zoneCode"
          name="zoneCode"
          placeholder="State / Province"
          required
          type="hidden"
        />

        <input
          autoComplete="country"
          defaultValue={'DK'}
          id="territoryCode"
          name="territoryCode"
          placeholder="Country"
          required
          type="hidden"
          maxLength={2}
        />
        <TextInput
          label={t('phone')}
          autoComplete="tel"
          defaultValue={address?.phoneNumber ?? ''}
          id="phoneNumber"
          name="phoneNumber"
          placeholder="+45XXXXXXXX"
          pattern="^\+?[1-9]\d{3,14}$"
          type="tel"
          maxLength={11}
        />
        <input
          aria-label="Company"
          autoComplete="organization"
          defaultValue={address?.company ?? ''}
          id="company"
          name="company"
          placeholder="Company"
          type="hidden"
        />
        <div>
          <Checkbox
            defaultChecked={isDefaultAddress}
            label={t('default_address')}
            id="defaultAddress"
            name="defaultAddress"
            type="checkbox"
          />
        </div>
        {error ? (
          <p>
            <mark>
              <small>{error}</small>
            </mark>
          </p>
        ) : null}
        {children({
          stateForMethod: (method) => (formMethod === method ? state : 'idle'),
        })}
      </Stack>
    </Form>
  );
}
