import {Button, Flex} from '@mantine/core';
import {type FetcherWithComponents} from '@remix-run/react';
import {CartForm, parseGid} from '@shopify/hydrogen';
import {type CartLineInput} from '@shopify/hydrogen/storefront-api-types';
import {IconPaywall, IconShoppingCart} from '@tabler/icons-react';
import {format} from 'date-fns';
import da from 'date-fns/locale/da';
import {type CartProductsFragment} from 'storefrontapi.generated';
import type {CustomerLocation, UserAvailabilitySingle} from '~/lib/api/model';
import {durationToTime} from '~/lib/duration';
import {matchesGid} from '~/lib/matches-gid';

type AddToCartTreatmentProps = {
  availability: UserAvailabilitySingle;
  products: CartProductsFragment[];
  location: CustomerLocation;
  groupId: string;
  redirectTo?: string;
};

export function AddToCartTreatment({
  availability,
  products,
  location,
  groupId,
  redirectTo,
}: AddToCartTreatmentProps) {
  const lines: Array<CartLineInput> = products
    .filter((product) =>
      availability.slot.products.some(
        (p) => p.productId.toString() === parseGid(product.id).id,
      ),
    )
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

      if (slotProduct.parentId) {
        input.attributes.push({
          key: '_parentId',
          value: slotProduct.parentId.toString(),
        });

        const parentProduct = products.find((p) =>
          matchesGid(p.id, slotProduct.parentId!),
        );

        if (parentProduct?.title) {
          input.attributes.push({
            key: 'Til: ',
            value: parentProduct?.title,
          });
        }
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
    });

  //<AddToCartButton lines={lines}>Tilføj indkøbskurv</AddToCartButton>
  return (
    <Flex justify="flex-end" gap="md">
      <AddToCartButton lines={lines} redirectTo={redirectTo}>
        Gå til betaling
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
