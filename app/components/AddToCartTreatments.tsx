import {Button, Flex} from '@mantine/core';
import {type FetcherWithComponents} from '@remix-run/react';
import {CartForm} from '@shopify/hydrogen';
import {type CartLineInput} from '@shopify/hydrogen/storefront-api-types';
import {IconPaywall, IconShoppingCart} from '@tabler/icons-react';
import {useTranslation} from 'react-i18next';
import type {CustomerLocation, UserAvailabilitySingle} from '~/lib/api/model';
import {durationToTime, useDate} from '~/lib/duration';

type AddToCartTreatmentProps = {
  availability: UserAvailabilitySingle;
  location: CustomerLocation;
  groupId: string;
  redirectTo?: string;
};

export function AddToCartTreatment({
  availability,
  location,
  groupId,
  redirectTo,
}: AddToCartTreatmentProps) {
  const {t} = useTranslation('global');
  const {format} = useDate();

  const lines: Array<CartLineInput> = availability.slot.products.map(
    (slotProduct) => {
      const input = {
        merchandiseId: `gid://shopify/ProductVariant/${
          slotProduct.variantId || ''
        }`,
        quantity: 1,
        attributes: [
          {
            key: '_from',
            value: slotProduct.from,
          },
          {
            key: '_to',
            value: slotProduct.to,
          },
          {
            key: '_customerId',
            value: availability.customer.customerId.toString(),
          },
          {
            key: '_artistName',
            value: availability.customer.fullname,
          },
          {
            key: '_artistImage',
            value:
              'https://cdn.shopify.com/s/files/1/0682/4060/5458/files/7932440281415_customer_profile_1716936650197.jpg?v=1716936672',
          },
          {
            key: '_bundleId',
            value: 'gid://shopify/ProductVariant/48762648691015',
          },

          {
            key: '_locationId',
            value: location._id,
          },
          {
            key: '_groupId',
            value: groupId,
          },
          {
            key: 'Skønhedsekspert',
            value: availability.customer.fullname,
          },
          {
            key: 'Tid',
            value: `${format(
              new Date(slotProduct.from),
              "EEEE',' 'd.' d'.' LLL 'kl 'HH:mm",
            )}`,
          },
          {
            key: 'Varighed',
            value: `${durationToTime(slotProduct.duration)}`,
          },
        ],
      };

      if (slotProduct.parentId) {
        input.attributes.push({
          key: '_parentId',
          value: slotProduct.parentId.toString(),
        });
      }

      if (availability.shipping) {
        input.attributes.push(
          {
            key: '_shippingId',
            value: availability.shipping._id,
          },
          {
            key: '_freeShipping',
            value: 'true',
          },
        );
      }

      return input;
    },
  );

  //<AddToCartButton lines={lines}>Tilføj indkøbskurv</AddToCartButton>
  return (
    <Flex justify="flex-end" gap="md">
      <AddToCartButton lines={lines} redirectTo={redirectTo}>
        {t('goto_payment')}
      </AddToCartButton>
    </Flex>
  );
}

export function AddToCartButton({
  analytics,
  children,
  disabled,
  lines,
  onClick,
  redirectTo,
}: {
  analytics?: unknown;
  children: React.ReactNode;
  disabled?: boolean;
  lines: CartLineInput[];
  onClick?: () => void;
  redirectTo?: string;
}) {
  return (
    <CartForm route="/cart" inputs={{lines}} action={CartForm.ACTIONS.LinesAdd}>
      {(fetcher: FetcherWithComponents<any>) => {
        return (
          <>
            <input
              type="hidden"
              name="redirectTo"
              defaultValue={redirectTo || ''}
            />
            <input
              name="analytics"
              type="hidden"
              value={JSON.stringify(analytics)}
            />
            <Button
              variant="fill"
              color="black"
              size="lg"
              fullWidth
              type="submit"
              onClick={onClick}
              leftSection={redirectTo ? <IconPaywall /> : <IconShoppingCart />}
              disabled={disabled ?? fetcher.state !== 'idle'}
            >
              {children}
            </Button>
          </>
        );
      }}
    </CartForm>
  );
}
