import {Button, Modal, Stack, Title} from '@mantine/core';
import {
  useLoaderData,
  useSearchParams,
  type ShouldRevalidateFunctionArgs,
} from '@remix-run/react';
import {json, type LoaderFunctionArgs} from '@remix-run/server-runtime';
import {parseGid} from '@shopify/hydrogen';
import type {TreatmentProductWithOptionsFragment} from 'storefrontapi.generated';

import {
  OptionSelector,
  ProductOption,
  redirectToOptions,
  useCalculateDurationAndPrice,
} from '~/components/OptionSelector';

import {useMediaQuery} from '@mantine/hooks';
import {TreatmentStepper} from '~/components/TreatmentStepper';
import {GET_PRODUCT_WITH_OPTIONS} from './artist_.$username.treatment.$productHandle';

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

  const {product} = await storefront.query(GET_PRODUCT_WITH_OPTIONS, {
    variables: {
      productHandle,
    },
  });

  if (!product) {
    throw new Response('Product handle is wrong', {
      status: 404,
    });
  }

  if (product?.options?.references?.nodes) {
    redirectToOptions({
      productOptions: product?.options?.references?.nodes,
      request,
    });
  }

  return json({
    product,
  });
}

export default function ArtistTreatmentPickMoreIndex() {
  const data = useLoaderData<typeof loader>();

  if (!data) {
    return <></>;
  }

  return <ArtistTreatmentPickMoreRenderModal product={data.product} />;
}

function ArtistTreatmentPickMoreRenderModal({
  product,
}: {
  product: TreatmentProductWithOptionsFragment;
}) {
  const isMobile = useMediaQuery('(max-width: 62em)');
  const productOptions = product.options?.references?.nodes;
  const {totalDuration, totalPrice} = useCalculateDurationAndPrice({
    parentId: product.id,
    productOptions,
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
      productOptions?.forEach((p) => {
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

  const required = productOptions?.filter(
    (p) => p.required?.value.toLowerCase() === 'true',
  );

  const choices = productOptions?.filter(
    (p) => p.required?.value.toLowerCase() !== 'true',
  );

  return (
    <Modal
      opened={opened}
      onClose={close}
      title={product.title}
      size="xl"
      fullScreen={isMobile}
    >
      {productOptions ? (
        <>
          <Title order={3} fw={600} mb="sm" fz="h3" ta="center">
            Påkrævet valg
          </Title>
          <Stack gap="md">
            {required?.map((productWithVariants) => {
              return (
                <OptionSelector
                  key={productWithVariants.id}
                  productWithVariants={productWithVariants}
                >
                  {(props) => {
                    return <ProductOption {...props} />;
                  }}
                </OptionSelector>
              );
            })}
          </Stack>
          <Title order={3} fw={600} mt="xl" mb="sm" fz="h3" ta="center">
            Vælg tilvalg:
          </Title>
          <Stack gap="md">
            {choices?.map((productWithVariants) => {
              return (
                <OptionSelector
                  key={productWithVariants.id}
                  productWithVariants={productWithVariants}
                >
                  {(props) => {
                    return <ProductOption {...props} />;
                  }}
                </OptionSelector>
              );
            })}
          </Stack>
        </>
      ) : null}

      <TreatmentStepper
        totalPrice={totalPrice}
        totalDuration={totalDuration}
        mt="lg"
      >
        <Button variant="filled" color="red" onClick={close}>
          Fjern ydelse
        </Button>
        <Button variant="filled" onClick={onClick}>
          Tilføj ydelse
        </Button>
      </TreatmentStepper>
    </Modal>
  );
}
