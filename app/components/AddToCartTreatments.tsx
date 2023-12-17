import {useFetchers} from '@remix-run/react';
import {parseGid} from '@shopify/hydrogen';
import {type CartLineInput} from '@shopify/hydrogen/storefront-api-types';
import {format} from 'date-fns';
import da from 'date-fns/locale/da';
import {useState} from 'react';
import {type ArtistServicesProductsQuery} from 'storefrontapi.generated';
import type {CustomerLocation, UserAvailabilitySingle} from '~/lib/api/model';
import {durationToTime} from '~/lib/duration';
import {AddToCartButton} from '~/routes/($locale).products.$handle';

type AddToCartTreatmentProps = {
  availability: UserAvailabilitySingle;
  products: ArtistServicesProductsQuery['products'];
  location: CustomerLocation;
};

export function AddToCartTreatment({
  availability,
  products,
  location,
}: AddToCartTreatmentProps) {
  const [disabled, setDisabled] = useState(false);
  const fetcher = useFetchers();
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
            key: '_freeShipping',
            value: 'true',
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
        input.attributes.push({
          key: '_shippingId',
          value: availability.shipping._id,
        });
      }

      return input;
    });

  return (
    <AddToCartButton
      onClick={() => {
        window.location.href = window.location.href + '#cart-aside';
      }}
      lines={lines}
    >
      Tilføj indkøbskurv
    </AddToCartButton>
  );
}
