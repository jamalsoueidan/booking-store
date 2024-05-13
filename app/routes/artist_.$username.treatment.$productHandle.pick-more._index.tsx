import {Button, Divider, Modal, Stack, Text} from '@mantine/core';
import {
  useLoaderData,
  useSearchParams,
  type ShouldRevalidateFunctionArgs,
} from '@remix-run/react';
import {json, type LoaderFunctionArgs} from '@remix-run/server-runtime';
import {Money, parseGid} from '@shopify/hydrogen';
import type {
  ArtistTreatmentIndexQuery,
  ArtistTreatmentProductFragment,
} from 'storefrontapi.generated';

import {
  OptionSelector,
  ProductOption,
  redirectToOptions,
  useCalculateDurationAndPrice,
} from '~/components/OptionSelector';
import {ArtistTreatment} from '~/graphql/artist/ArtistTreatment';
import {ArtistTreatmentIndex} from '~/graphql/artist/ArtistTreatmentIndex';

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
    return json(null); // don't throw, this is for index file
  }

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

  const {products: productOptions} = await storefront.query(
    ArtistTreatmentIndex,
    {
      variables: {
        query: `tag:'parent-${productHandle}' AND tag:'options'`,
        country: storefront.i18n.country,
        language: storefront.i18n.language,
      },
    },
  );

  if (productOptions.nodes.length > 0) {
    redirectToOptions({
      productOptions: productOptions.nodes,
      request,
    });
  }

  return json({
    product,
    productOptions,
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
  product: ArtistTreatmentProductFragment;
  productOptions: ArtistTreatmentIndexQuery['products'];
};

function ArtistTreatmentPickMoreRenderModal({
  product,
  productOptions,
}: ArtistTreatmentPickMoreRenderModalProps) {
  const {totalDuration, totalPrice} = useCalculateDurationAndPrice({
    parentId: product.id,
    productOptions: productOptions.nodes,
    currentPrice: parseInt(product.variants.nodes[0].price.amount || '0'),
    currentDuration: parseInt(product.duration?.value || '0'),
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
      productOptions.nodes.forEach((p) => {
        prev.delete(`options[${parseGid(product.id).id}][${parseGid(p.id)}]`);
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
      {productOptions.nodes.map((productWithVariants) => {
        return (
          <OptionSelector
            key={product.id}
            productWithVariants={productWithVariants}
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
