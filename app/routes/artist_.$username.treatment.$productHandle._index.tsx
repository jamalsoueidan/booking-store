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
import React from 'react';
import type {
  TreatmentOptionsFragment,
  TreatmentVariantFragment,
} from 'storefrontapi.generated';
import {ArtistShell} from '~/components/ArtistShell';
import {TreatmentStepper} from '~/components/TreatmentStepper';
import {TREATMENT_OPTIONS_QUERY} from '~/graphql/storefront/TreatmentOptions';
import {getBookingShopifyApi} from '~/lib/api/bookingShopifyApi';
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

  if (productsWithVariants.nodes.length > 0) {
    redirectToVariants({
      productsWithVariants: productsWithVariants.nodes,
      request,
    });
  }

  const selectedVariants = pickedVariants({
    productsWithVariants: productsWithVariants.nodes,
    request,
  });

  return json({productsWithVariants, selectedVariants});
}

export default function ProductDescription() {
  const {productsWithVariants, selectedVariants} =
    useLoaderData<typeof loader>();
  const {product} = useOutletContext<SerializeFrom<typeof rootLoader>>();
  const {descriptionHtml} = product;

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
        {productsWithVariants.nodes.map((productVariant) => (
          <VariantSelector
            key={productVariant.id}
            productVariant={productVariant}
          >
            {(props) => {
              return <ProductOption {...props} />;
            }}
          </VariantSelector>
        ))}
        <Divider />
        Total pris: {product.selectedVariant?.price.amount}
        Valg:
        {selectedVariants[0].price.amount}
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

type VariantSelectorChildrenProp = {
  productId: TreatmentOptionsFragment['id'];
  variant: TreatmentVariantFragment;
};

function VariantSelector({
  productVariant,
  children,
}: {
  productVariant: TreatmentOptionsFragment;
  children: ({
    productId,
    variant,
  }: VariantSelectorChildrenProp) => React.ReactElement;
}) {
  const optionsMarkup = productVariant.variants.nodes.map((variant) => {
    return (
      <Flex key={variant.id}>
        {children({productId: productVariant.id, variant})}
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

function ProductOption({productId, variant}: VariantSelectorChildrenProp) {
  const [searchParams, setSearchParams] = useSearchParams();
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
        pickedVariantsInURL[parseGid(productId).id] === parseGid(variant.id).id
          ? 'outline'
          : undefined
      }
    >
      {variant.title} +<Money as="span" data={variant.price} withoutCurrency />
      &nbsp; DKK
    </Button>
  );
}
