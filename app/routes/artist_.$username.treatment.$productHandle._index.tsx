import {Button, Divider, Flex, Text, Title} from '@mantine/core';
import {
  Link,
  redirect,
  useLoaderData,
  useLocation,
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
  TreatmentOptionsFragment,
  TreatmentVariantFragment,
} from 'storefrontapi.generated';
import {ArtistShell} from '~/components/ArtistShell';
import {TreatmentStepper} from '~/components/TreatmentStepper';
import {TREATMENT_OPTIONS_QUERY} from '~/graphql/storefront/TreatmentOptions';
import {getBookingShopifyApi} from '~/lib/api/bookingShopifyApi';
import type {
  CustomerProductBaseOptionsItem,
  CustomerProductBaseOptionsItemVariantsItem,
} from '~/lib/api/model';
import {matchesGid} from '~/lib/matches-gid';
import type {loader as rootLoader} from './artist_.$username.treatment.$productHandle';

function redirectToVariants({
  productsWithVariants,
  request,
}: {
  productsWithVariants: TreatmentOptionsFragment[];
  request: Request;
}) {
  const url = new URL(request.url);
  const searchParams = new URLSearchParams(url.search);

  const requiredParams = productsWithVariants.map((product) => {
    const productId = parseGid(product.id).id;
    const firstVariant = product.variants.nodes[0];
    return {value: parseGid(firstVariant.id).id, name: productId};
  });

  const missingParams = requiredParams.filter(
    (param) => !searchParams.has(`options[${param.name}]`),
  );

  if (missingParams.length > 0) {
    missingParams.forEach((param) => {
      searchParams.set(`options[${param.name}]`, param.value);
    });

    url.search = searchParams.toString();
    throw redirect(url.toString(), {
      status: 302,
    });
  }
}

function parseNestedQueryParameters(search: string) {
  const searchParams = new URLSearchParams(search);
  const options: Record<string, string> = {};

  for (const [key, value] of searchParams.entries()) {
    const match = key.match(/^options\[(.+)\]$/);
    if (match) {
      options[match[1]] = value;
    }
  }

  return options;
}

function pickedVariants({
  productsWithVariants,
  request,
}: {
  productsWithVariants: TreatmentOptionsFragment[];
  request: Request;
}) {
  const parsedUrl = new URL(request.url);
  const pickedVariantsInURL = parseNestedQueryParameters(parsedUrl.search);

  const variants = productsWithVariants.map((product) => {
    const value = pickedVariantsInURL[parseGid(product.id).id];
    const pickedVariant = product.variants.nodes.find(
      (variant) => parseGid(variant.id).id === value,
    );
    if (!pickedVariant) {
      throw new Response('Variant not found', {status: 404});
    }
    return pickedVariant;
  });

  return variants;
}

function pickedOptions({
  userProductsOptions,
  request,
}: {
  userProductsOptions: CustomerProductBaseOptionsItem[];
  request: Request;
}) {
  const parsedUrl = new URL(request.url);
  const pickedVariantsInURL = parseNestedQueryParameters(parsedUrl.search);

  const variants = userProductsOptions.map((product) => {
    const value = pickedVariantsInURL[product.productId];
    const pickedVariant = product.variants.find(
      ({variantId}) => variantId.toString() === value,
    );
    if (!pickedVariant) {
      throw new Response('Variant not found', {status: 404});
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

  const {products: productsWithVariants} = await storefront.query(
    TREATMENT_OPTIONS_QUERY,
    {
      variables: {
        query:
          productIds.length > 0 ? productIds.join(' OR ') : '---nothing---',
        country: storefront.i18n.country,
        language: storefront.i18n.language,
      },
    },
  );

  let selectedVariants: TreatmentVariantFragment[] = [];
  let selectedOptions: CustomerProductBaseOptionsItemVariantsItem[] = [];

  if (productsWithVariants.nodes.length > 0) {
    redirectToVariants({
      productsWithVariants: productsWithVariants.nodes,
      request,
    });
  }

  if (userProduct.options) {
    selectedVariants = pickedVariants({
      productsWithVariants: productsWithVariants.nodes,
      request,
    });

    selectedOptions = pickedOptions({
      userProductsOptions: userProduct.options,
      request,
    });
  }

  return json({
    productsWithVariants, // to render all variants
    userProductsOptions: userProduct.options, //to get all durations
    selectedVariants, //for calculate price
    selectedOptions, //for calculate duration
  });
}

export default function ProductDescription() {
  const {
    productsWithVariants,
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
        {productsWithVariants ? (
          <>
            {productsWithVariants.nodes.map((productVariant) => {
              const userProductOptions = userProductsOptions.find((up) =>
                matchesGid(productVariant.id, up.productId),
              );
              if (!userProductOptions) {
                return <>Error: option not found</>;
              }

              return (
                <VariantSelector
                  key={productVariant.id}
                  productVariant={productVariant}
                  userProductOptions={userProductOptions}
                >
                  {(props) => {
                    return <ProductOption {...props} />;
                  }}
                </VariantSelector>
              );
            })}
            <Divider />
            Total pris:{' '}
            <Money
              as="span"
              data={{
                __typename: 'MoneyV2',
                amount: totalPrice.toString(),
                currencyCode: 'DKK',
              }}
            />
            Total tid: {totalTime} min
          </>
        ) : null}
      </ArtistShell.Main>
      <ArtistShell.Footer>
        <TreatmentStepper>
          <Button variant="default" component={Link} to="pick-options">
            Bestil tid
          </Button>
        </TreatmentStepper>
      </ArtistShell.Footer>
    </>
  );
}

type VariantSelectorProps = {
  userProductOptions: CustomerProductBaseOptionsItem;
  productVariant: TreatmentOptionsFragment;
  children: ({
    productId,
    variant,
    userVariant,
  }: VariantSelectorChildrenProp) => React.ReactElement;
};

type VariantSelectorChildrenProp = {
  productId: TreatmentOptionsFragment['id'];
  variant: TreatmentVariantFragment;
  userVariant: CustomerProductBaseOptionsItemVariantsItem;
};

function VariantSelector({
  productVariant,
  userProductOptions,
  children,
}: VariantSelectorProps) {
  const optionsMarkup = productVariant.variants.nodes.map((variant) => {
    const userVariant = userProductOptions.variants.find((v) =>
      matchesGid(variant.id, v.variantId),
    );

    if (!userVariant) {
      return <>Error: variant not found</>;
    }

    return (
      <Flex key={variant.id}>
        {children({productId: productVariant.id, variant, userVariant})}
      </Flex>
    );
  });

  return (
    <Flex direction="column" gap="xs" py="sm">
      <Title order={2}>{productVariant.title}</Title>
      <Flex direction="column" gap="xs">
        {optionsMarkup}
      </Flex>
    </Flex>
  );
}

function ProductOption({
  productId,
  variant,
  userVariant,
}: VariantSelectorChildrenProp) {
  const [, setSearchParams] = useSearchParams();
  const location = useLocation();
  const pickedVariantsInURL = parseNestedQueryParameters(location.search);

  const updateSearchParams = () => {
    setSearchParams((prev) => {
      prev.set(`options[${parseGid(productId).id}]`, parseGid(variant.id).id);
      return prev;
    });
  };

  return (
    <Button
      onClick={updateSearchParams}
      variant={
        pickedVariantsInURL[parseGid(productId).id] !== parseGid(variant.id).id
          ? 'outline'
          : 'transparent'
      }
    >
      {variant.title} +<Money as="span" data={variant.price} withoutCurrency />
      &nbsp; DKK - {userVariant.duration} min
    </Button>
  );
}
