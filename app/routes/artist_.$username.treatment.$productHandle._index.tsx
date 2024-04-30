import {Button, Divider, Flex, Text, Title} from '@mantine/core';
import {
  Link,
  redirect,
  useLoaderData,
  useOutletContext,
  useSearchParams,
} from '@remix-run/react';
import {
  json,
  type LoaderFunctionArgs,
  type SerializeFrom,
} from '@remix-run/server-runtime';
import {Money, parseGid} from '@shopify/hydrogen';
import {type ProductOption} from '@shopify/hydrogen-react/storefront-api-types';
import React, {useMemo} from 'react';
import type {
  ArtistTreatmentIndexProductFragment,
  ArtistTreatmentIndexVariantFragment,
} from 'storefrontapi.generated';
import {ArtistShell} from '~/components/ArtistShell';
import {TreatmentStepper} from '~/components/TreatmentStepper';
import {ArtistTreatmentIndexQuery} from '~/graphql/storefront/ArtistTreatmentIndex';
import {getBookingShopifyApi} from '~/lib/api/bookingShopifyApi';
import type {
  CustomerProductBaseOptionsItem,
  CustomerProductBaseOptionsItemVariantsItem,
} from '~/lib/api/model';
import {durationToTime} from '~/lib/duration';
import {matchesGid} from '~/lib/matches-gid';
import type {loader as rootLoader} from './artist_.$username.treatment.$productHandle';

type RedirectToVariantsProps = {
  parentId: number;
  allProductOptionsWithVariants: ArtistTreatmentIndexProductFragment[];
  request: Request;
};

function redirectToVariants({
  parentId,
  allProductOptionsWithVariants,
  request,
}: RedirectToVariantsProps) {
  const url = new URL(request.url);
  const searchParams = new URLSearchParams(url.search);

  const requiredParams = allProductOptionsWithVariants.map((product) => {
    const productId = parseGid(product.id).id;
    const firstVariant = product.variants.nodes[0];
    return {value: parseGid(firstVariant.id).id, name: productId};
  });

  const missingParams = requiredParams.filter(
    (param) => !searchParams.has(`options[${parentId}][${param.name}]`),
  );

  if (missingParams.length > 0) {
    missingParams.forEach((param) => {
      searchParams.set(`options[${parentId}][${param.name}]`, param.value);
    });

    url.search = searchParams.toString();
    throw redirect(url.toString(), {
      status: 302,
    });
  }
}

function pickedVariants({
  parentId,
  allProductOptionsWithVariants,
  request,
}: RedirectToVariantsProps) {
  const url = new URL(request.url);
  const searchParams = new URLSearchParams(url.search);

  const variants = allProductOptionsWithVariants.map((product) => {
    const value = searchParams.get(
      `options[${parentId}][${parseGid(product.id).id}]`,
    );
    const pickedVariant = product.variants.nodes.find(
      (variant) => parseGid(variant.id).id === value,
    );
    if (!pickedVariant) {
      throw new Response('PickedVarients - Variant not found', {status: 404});
    }
    return pickedVariant;
  });

  return variants;
}

function pickedOptions({
  parentId,
  userProductsOptions,
  request,
}: {
  parentId: number;
  userProductsOptions: CustomerProductBaseOptionsItem[];
  request: Request;
}) {
  const url = new URL(request.url);
  const searchParams = new URLSearchParams(url.search);

  const variants = userProductsOptions.map((product) => {
    const value = searchParams.get(
      `options[${parentId}][${product.productId}]`,
    );
    const pickedVariant = product.variants.find(
      ({variantId}) => variantId.toString() === value,
    );
    if (!pickedVariant) {
      throw new Response('PickedOptions - Variant not found', {status: 404});
    }
    return pickedVariant;
  });

  return variants;
}

export async function loader({params, request, context}: LoaderFunctionArgs) {
  const {username, productHandle} = params;
  const {storefront} = context;

  if (!productHandle || !username) {
    throw new Response('Expected product handle to be defined', {status: 404});
  }
  const {payload: userProduct} = await getBookingShopifyApi().userProductGet(
    username,
    productHandle,
  );

  if (!productHandle || !userProduct.selectedOptions) {
    throw new Error('productHandle and selectedOptions must be provided');
  }

  const productIds = userProduct.options?.map((p) => p.productId) || [];

  const {products: allProductOptionsWithVariants} = await storefront.query(
    ArtistTreatmentIndexQuery,
    {
      variables: {
        query: productIds.length > 0 ? productIds.join(' OR ') : 'tag:"-"',
        country: storefront.i18n.country,
        language: storefront.i18n.language,
      },
    },
  );

  let selectedVariants: ArtistTreatmentIndexVariantFragment[] = [];
  let selectedOptions: CustomerProductBaseOptionsItemVariantsItem[] = [];

  if (allProductOptionsWithVariants.nodes.length > 0) {
    redirectToVariants({
      parentId: userProduct.productId,
      allProductOptionsWithVariants: allProductOptionsWithVariants.nodes,
      request,
    });
  }

  if (userProduct.options) {
    selectedVariants = pickedVariants({
      parentId: userProduct.productId,
      allProductOptionsWithVariants: allProductOptionsWithVariants.nodes,
      request,
    });

    selectedOptions = pickedOptions({
      parentId: userProduct.productId,
      userProductsOptions: userProduct.options,
      request,
    });
  }

  return json({
    allProductOptionsWithVariants, // to render all variants
    userProductsOptions: userProduct.options, //to get all durations
    selectedVariants, //for calculate price
    selectedOptions, //for calculate duration
  });
}

export default function ProductDescription() {
  const [searchParams] = useSearchParams();

  const {
    allProductOptionsWithVariants,
    selectedVariants,
    userProductsOptions,
    selectedOptions,
  } = useLoaderData<typeof loader>();

  const {product, userProduct} =
    useOutletContext<SerializeFrom<typeof rootLoader>>();
  const {descriptionHtml} = product;

  const totalPrice = useMemo(() => {
    return selectedVariants.reduce(
      (total, variant) => total + parseInt(variant.price.amount || ''),
      parseInt(product.selectedVariant?.price.amount || '0'),
    );
  }, [product.selectedVariant?.price.amount, selectedVariants]);

  const totalTime = useMemo(() => {
    return selectedOptions.reduce((total, option) => {
      return total + option.duration;
    }, userProduct.duration);
  }, [selectedOptions, userProduct.duration]);

  return (
    <>
      <ArtistShell.Main>
        <Text
          size="lg"
          c="dimmed"
          fw={400}
          dangerouslySetInnerHTML={{__html: descriptionHtml}}
        ></Text>
        <Divider />
        {allProductOptionsWithVariants ? (
          <>
            {allProductOptionsWithVariants.nodes.map(
              (productOptionWithVariants) => {
                const userProductOptions = userProductsOptions.find((up) =>
                  matchesGid(productOptionWithVariants.id, up.productId),
                );
                if (!userProductOptions) {
                  return <>Error: option not found</>;
                }

                return (
                  <VariantSelector
                    key={productOptionWithVariants.id}
                    parentId={parseGid(product.id).id}
                    productOptionWithVariants={productOptionWithVariants}
                    userProductOptions={userProductOptions}
                  >
                    {(props) => {
                      return <ProductOption {...props} />;
                    }}
                  </VariantSelector>
                );
              },
            )}
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
          </>
        ) : null}
      </ArtistShell.Main>
      <ArtistShell.Footer>
        <TreatmentStepper>
          <Button
            variant="default"
            component={Link}
            to={`pick-location?${searchParams.toString()}`}
            relative="route"
          >
            Bestil tid
          </Button>
        </TreatmentStepper>
      </ArtistShell.Footer>
    </>
  );
}

type VariantSelectorProps = {
  parentId: string;
  userProductOptions: CustomerProductBaseOptionsItem;
  productOptionWithVariants: ArtistTreatmentIndexProductFragment;
  children: (props: VariantSelectorChildrenProp) => React.ReactElement;
};

type VariantSelectorChildrenProp = {
  parentId: string;
  productOptionWithVariants: ArtistTreatmentIndexProductFragment;
  variant: ArtistTreatmentIndexVariantFragment;
  userVariant: CustomerProductBaseOptionsItemVariantsItem;
};

function VariantSelector({
  parentId,
  productOptionWithVariants,
  userProductOptions,
  children,
}: VariantSelectorProps) {
  const optionsMarkup = productOptionWithVariants.variants.nodes.map(
    (variant) => {
      const userVariant = userProductOptions.variants.find((v) =>
        matchesGid(variant.id, v.variantId),
      );

      if (!userVariant) {
        return <>Error: variant not found</>;
      }

      return (
        <Flex key={variant.id}>
          {children({
            parentId,
            productOptionWithVariants,
            variant,
            userVariant,
          })}
        </Flex>
      );
    },
  );

  return (
    <Flex direction="column" gap="xs" py="sm">
      <Title order={2}>{productOptionWithVariants.title}</Title>
      <Flex direction="column" gap="xs">
        {optionsMarkup}
      </Flex>
    </Flex>
  );
}

function ProductOption({
  parentId,
  productOptionWithVariants,
  variant,
  userVariant,
}: VariantSelectorChildrenProp) {
  const [searchParams, setSearchParams] = useSearchParams();
  const productId = parseGid(productOptionWithVariants.id).id;
  const value = searchParams.get(`options[${parentId}][${productId}]`);

  const updateSearchParams = () => {
    setSearchParams((prev) => {
      prev.set(`options[${parentId}][${productId}]`, parseGid(variant.id).id);
      return prev;
    });
  };

  return (
    <Button
      onClick={updateSearchParams}
      variant={value !== parseGid(variant.id).id ? 'outline' : 'transparent'}
    >
      {variant.title} +<Money as="span" data={variant.price} withoutCurrency />
      &nbsp; DKK - {userVariant.duration} min
    </Button>
  );
}
