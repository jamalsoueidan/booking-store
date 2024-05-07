import {Button, Divider, Modal, Stack, Text} from '@mantine/core';
import {
  type ShouldRevalidateFunctionArgs,
  useLoaderData,
  useSearchParams,
} from '@remix-run/react';
import {json, type LoaderFunctionArgs} from '@remix-run/server-runtime';
import {Money, parseGid} from '@shopify/hydrogen';
import {type ArtistTreatmentIndexQuery} from 'storefrontapi.generated';

import {
  OptionSelector,
  ProductOption,
  redirectToOptions,
  useCalculateDurationAndPrice,
} from '~/components/OptionSelector';
import {ArtistTreatment} from '~/graphql/artist/ArtistTreatment';
import {ArtistTreatmentIndex} from '~/graphql/artist/ArtistTreatmentIndex';
import {getBookingShopifyApi} from '~/lib/api/bookingShopifyApi';

import type {CustomerProductList} from '~/lib/api/model';
import {durationToTime} from '~/lib/duration';

export function shouldRevalidate({
  currentUrl,
  nextUrl,
}: ShouldRevalidateFunctionArgs) {
  const currentSearchParams = currentUrl.searchParams;
  const nextSearchParams = nextUrl.searchParams;

  const currentParamsCopy = new URLSearchParams(currentSearchParams);
  const nextParamsCopy = new URLSearchParams(nextSearchParams);

  const currentModal = currentParamsCopy.get('modal');
  const nextModal = nextParamsCopy.get('modal');

  return currentModal !== nextModal;
}

export async function loader({params, request, context}: LoaderFunctionArgs) {
  const {storefront} = context;
  const url = new URL(request.url);
  const searchParams = new URLSearchParams(url.search);

  const productHandle = searchParams.get('modal');
  const {username} = params;

  if (!productHandle || !username) {
    return json(null); // don't throw, this is index file
  }

  const {payload: userProduct} = await getBookingShopifyApi().userProductGet(
    username,
    productHandle,
  );

  const {product} = await storefront.query(ArtistTreatment, {
    variables: {
      productHandle,
      country: storefront.i18n.country,
      language: storefront.i18n.language,
    },
  });

  if (!product) {
    throw new Response('product cant be found', {
      status: 404,
    });
  }

  const {products: allProductOptionsWithVariants} =
    await context.storefront.query(ArtistTreatmentIndex, {
      variables: {
        query: `tag:'product-${productHandle}' AND tag:'user-${username}'`,
        country: context.storefront.i18n.country,
        language: context.storefront.i18n.language,
      },
    });

  if (allProductOptionsWithVariants.nodes.length > 0) {
    redirectToOptions({
      parentId: parseGid(product?.id).id,
      allProductOptionsWithVariants: allProductOptionsWithVariants.nodes,
      request,
    });
  }

  return json({
    product,
    allProductOptionsWithVariants, // to render all variants
    userProduct,
  });
}

export default function ArtistTreatmentPickMoreIndex() {
  const data = useLoaderData<typeof loader>();

  if (!data) {
    return <></>;
  }

  return <ArtistTreatmentPickMoreRenderModal {...data} />;
}

type ArtistTreatmentPickMoreRenderModalProps = {
  product: any;
  allProductOptionsWithVariants: ArtistTreatmentIndexQuery['products'];
  userProduct: CustomerProductList;
};

function ArtistTreatmentPickMoreRenderModal({
  product,
  allProductOptionsWithVariants,
  userProduct,
}: ArtistTreatmentPickMoreRenderModalProps) {
  const {totalDuration, totalPrice} = useCalculateDurationAndPrice({
    parentId: product.id,
    allProductOptionsWithVariants: allProductOptionsWithVariants.nodes,
    currentPrice: parseInt(userProduct.price.amount || '0'),
    currentDuration: userProduct?.duration,
  });

  const [searchParams, setSearchParams] = useSearchParams();
  const opened = !!searchParams.get('modal');

  const productID = parseGid(product.id).id;

  const close = () => {
    setSearchParams((prev) => {
      //remove from productIds
      const existingItems = prev.getAll('productIds');
      prev.delete('productIds');
      existingItems.forEach((item) => {
        if (item !== productID) {
          prev.append('productIds', item);
        }
      });

      //remove options
      userProduct.options.forEach((p) => {
        prev.delete(`options[${userProduct.productId}][${p.productId}]`);
      });

      //close modal
      prev.delete('modal');
      return prev;
    });
  };

  const onClick = () => {
    setSearchParams((prev) => {
      const existingItems = prev.getAll('productIds');
      if (existingItems.includes(productID)) {
        prev.delete('productIds');
        existingItems.forEach((item) => {
          if (item !== productID) {
            prev.append('productIds', item);
          }
        });
      } else {
        prev.append('productIds', productID);
      }
      prev.delete('modal'); // close modal
      return prev;
    });
  };

  return (
    <Modal opened={opened} onClose={close} title="Valg muligheder">
      {allProductOptionsWithVariants.nodes.map((productOptionWithVariants) => {
        return (
          <OptionSelector
            key={productOptionWithVariants.id}
            parentId={parseGid(product?.id).id}
            productOptionWithVariants={productOptionWithVariants}
          >
            {(props) => {
              return <ProductOption {...props} />;
            }}
          </OptionSelector>
        );
      })}
      <Divider mb="md" />
      <Text>
        Total pris:{' '}
        <Money
          as="span"
          data={{
            __typename: 'MoneyV2',
            amount: totalPrice.toString(),
            currencyCode: 'DKK',
          }}
        />
      </Text>
      Total tid: {durationToTime(totalDuration ?? 0)}
      <Stack>
        <Button onClick={onClick}>Tilføj ydelse</Button>
        <Button onClick={close}>Fjern ydelse</Button>
      </Stack>
    </Modal>
  );
}
