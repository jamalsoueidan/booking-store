import {Button} from '@mantine/core';
import {type FetcherWithComponents} from '@remix-run/react';
import {CartForm, parseGid} from '@shopify/hydrogen';
import {type CartLineInput} from '@shopify/hydrogen/storefront-api-types';
import {IconShoppingCart} from '@tabler/icons-react';
import {format} from 'date-fns';
import da from 'date-fns/locale/da';
import {type ArtistServicesProductsQuery} from 'storefrontapi.generated';
import type {CustomerLocation, UserAvailabilitySingle} from '~/lib/api/model';
import {durationToTime} from '~/lib/duration';

type AddToCartTreatmentProps = {
  availability: UserAvailabilitySingle;
  products: ArtistServicesProductsQuery['products'];
  location: CustomerLocation;
  groupId: string;
};

export function AddToCartTreatment({
  availability,
  products,
  location,
  groupId,
}: AddToCartTreatmentProps) {
  const lines: Array<CartLineInput> = products.nodes
    .filter((product) => {
      const slotProductExists = availability.slot.products.some(
        (p) => p.productId.toString() === parseGid(product.id).id,
      );
      return slotProductExists;
    })
    .map((product) => {
      const slotProduct = availability.slot.products.find(
        (p) => p.productId.toString() === parseGid(product.id).id,
      )!;

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
              "EEEE 'den' M'.' LLL 'kl 'HH:mm",
              {
                locale: da,
              },
            )}`,
          },
          {
            key: 'Varighed',
            value: `${durationToTime(slotProduct.duration)}`,
          },
        ],
      };

      if (availability.shipping) {
        input.attributes.push(
          {
            key: '_shippingId',
            value: availability.shipping._id,
          },
          // must be removed to enable shipping price
          {
            key: '_freeShipping',
            value: 'true',
          },
        );
      }

      return input;
    });

  return <AddToCartButton lines={lines}>Tilføj indkøbskurv</AddToCartButton>;
}

export function AddToCartButton({
  analytics,
  children,
  disabled,
  lines,
  onClick,
}: {
  analytics?: unknown;
  children: React.ReactNode;
  disabled?: boolean;
  lines: CartLineInput[];
  onClick?: () => void;
}) {
  return (
    <CartForm route="/cart" inputs={{lines}} action={CartForm.ACTIONS.LinesAdd}>
      {(fetcher: FetcherWithComponents<any>) => {
        return (
          <>
            <input type="hidden" name="redirectTo" defaultValue="cart" />
            <input
              name="analytics"
              type="hidden"
              value={JSON.stringify(analytics)}
            />
            <Button
              variant="filled"
              color="black"
              size="md"
              type="submit"
              onClick={onClick}
              leftSection={<IconShoppingCart />}
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
