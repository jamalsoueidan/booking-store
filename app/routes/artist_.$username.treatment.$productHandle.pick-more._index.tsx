import {Button, Divider, Modal, Stack, Text} from '@mantine/core';
import {
  type ShouldRevalidateFunctionArgs,
  useLoaderData,
  useSearchParams,
} from '@remix-run/react';
import {json, type LoaderFunctionArgs} from '@remix-run/server-runtime';
import {Money, parseGid} from '@shopify/hydrogen';
import {useMemo} from 'react';
import {type ArtistTreatmentIndexQuery} from 'storefrontapi.generated';

import {
  OptionSelector,
  ProductOption,
  redirectToOptions,
  usePickedOptionsToCalculateDuration,
  usePickedVariantsToCalculateTotalPrice,
} from '~/components/OptionSelector';
import {PRODUCT_SELECTED_OPTIONS_QUERY} from '~/data/queries';
import {ArtistTreatmentIndex} from '~/graphql/artist/ArtistTreatmentIndex';

import {getBookingShopifyApi} from '~/lib/api/bookingShopifyApi';
import type {CustomerProductList} from '~/lib/api/model';
import {durationToTime} from '~/lib/duration';
import {matchesGid} from '~/lib/matches-gid';

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
  const url = new URL(request.url);
  const searchParams = new URLSearchParams(url.search);

  const productHandle = searchParams.get('modal');
  const {username} = params;

  if (!productHandle || !username) {
    return json(null);
  }

  const {payload: userProduct} = await getBookingShopifyApi().userProductGet(
    username,
    productHandle,
  );

  const {product} = await context.storefront.query(
    PRODUCT_SELECTED_OPTIONS_QUERY,
    {
      variables: {
        productHandle,
        selectedOptions: userProduct.selectedOptions,
      },
    },
  );

  if (!product) {
    return json(null);
  }

  const productIds = userProduct.options?.map((p) => p.productId) || [];

  const {products: allProductOptionsWithVariants} =
    await context.storefront.query(ArtistTreatmentIndex, {
      variables: {
        query: productIds.length > 0 ? productIds.join(' OR ') : 'tag:"-"',
        country: context.storefront.i18n.country,
        language: context.storefront.i18n.language,
      },
    });

  if (allProductOptionsWithVariants.nodes.length > 0) {
    redirectToOptions({
      parentId: userProduct.productId,
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
  const allUserProductOptions = userProduct.options;
  const selectedVariants = usePickedVariantsToCalculateTotalPrice({
    parentId: userProduct.productId,
    allProductOptionsWithVariants: allProductOptionsWithVariants.nodes,
  });

  const selectedOptions = usePickedOptionsToCalculateDuration({
    parentId: userProduct.productId,
    userProductsOptions: userProduct.options,
  });

  const [searchParams, setSearchParams] = useSearchParams();
  const opened = !!searchParams.get('modal');

  const totalPrice = useMemo(() => {
    return selectedVariants.reduce(
      (total, variant) => total + parseInt(variant.price.amount || ''),
      parseInt(product?.selectedVariant?.price.amount || '0'),
    );
  }, [product?.selectedVariant?.price.amount, selectedVariants]);

  const totalTime = useMemo(() => {
    return selectedOptions?.reduce((total, option) => {
      return total + option.duration.value;
    }, userProduct?.duration);
  }, [selectedOptions, userProduct]);

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
        const userProductOptions = allUserProductOptions.find((up) =>
          matchesGid(productOptionWithVariants.id, up.productId),
        );
        if (!userProductOptions) {
          return <>Error: option not found</>;
        }

        return (
          <OptionSelector
            key={productOptionWithVariants.id}
            parentId={parseGid(product?.id).id}
            productOptionWithVariants={productOptionWithVariants}
            userProductOptions={userProductOptions}
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
      Total tid: {durationToTime(totalTime ?? 0)}
      <Stack>
        <Button onClick={onClick}>Tilføj ydelse</Button>
        <Button onClick={close}>Fjern ydelse</Button>
      </Stack>
    </Modal>
  );
}
