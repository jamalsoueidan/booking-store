import {
  Await,
  Link,
  useLoaderData,
  useNavigate,
  type FetcherWithComponents,
  type MetaFunction,
} from '@remix-run/react';
import {defer, redirect, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {Suspense, useEffect, useState} from 'react';
import type {
  ProductFragment,
  ProductVariantFragment,
} from 'storefrontapi.generated';

import {
  Avatar,
  Button,
  Paper,
  Select,
  SimpleGrid,
  Stack,
  Text,
  rem,
} from '@mantine/core';
import {
  CartForm,
  Money,
  VariantSelector,
  getSelectedProductOptions,
  parseGid,
  type VariantOption,
} from '@shopify/hydrogen';
import type {
  CartLineInput,
  SelectedOption,
} from '@shopify/hydrogen/storefront-api-types';
import {TreatmentPickArtistRadioCard} from '~/components/treatment/TreatmentPickArtistRadioCard';
import {getBookingShopifyApi} from '~/lib/api/bookingShopifyApi';
import {type ProductsGetUsersByVariant} from '~/lib/api/model';
import {getVariantUrlForTreatment} from '~/utils';

export const meta: MetaFunction<typeof loader> = ({data}) => {
  return [{title: `BySisters | ${data?.product.title ?? ''}`}];
};

export async function loader({params, request, context}: LoaderFunctionArgs) {
  const {handle} = params;
  const {storefront} = context;

  const selectedOptions = getSelectedProductOptions(request).filter(
    (option) =>
      // Filter out Shopify predictive search query params
      !option.name.startsWith('_sid') &&
      !option.name.startsWith('_pos') &&
      !option.name.startsWith('_psq') &&
      !option.name.startsWith('_ss') &&
      !option.name.startsWith('_v') &&
      // Filter out third party tracking params
      !option.name.startsWith('fbclid'),
  );

  if (!handle) {
    throw new Error('Expected product handle to be defined');
  }

  // await the query for the critical product data
  const {product} = await storefront.query(PRODUCT_QUERY, {
    variables: {handle, selectedOptions},
  });

  if (!product?.id) {
    throw new Response(null, {status: 404});
  }

  const firstVariant = product.variants.nodes[0];
  const firstVariantIsDefault = Boolean(
    firstVariant.selectedOptions.find(
      (option: SelectedOption) =>
        option.name === 'Title' && option.value === 'Default Title',
    ),
  );

  if (firstVariantIsDefault) {
    product.selectedVariant = firstVariant;
  } else {
    // if no selected variant was returned from the selected options,
    // we redirect to the first variant's url with it's selected options applied
    if (!product.selectedVariant) {
      throw redirectToFirstVariant({product, request});
    }
  }

  const users = getBookingShopifyApi().productsGetUsersByVariant({
    variantId: parseGid(product.selectedVariant.id).id,
    productId: parseGid(product.id).id,
  });

  // In order to show which variants are available in the UI, we need to query
  // all of them. But there might be a *lot*, so instead separate the variants
  // into it's own separate query that is deferred. So there's a brief moment
  // where variant options might show as available when they're not, but after
  // this deffered query resolves, the UI will update.
  const variants = storefront.query(VARIANTS_QUERY, {
    variables: {handle},
  });

  return defer({product, variants, users});
}

function redirectToFirstVariant({
  product,
  request,
}: {
  product: ProductFragment;
  request: Request;
}) {
  const url = new URL(request.url);
  const firstVariant = product.variants.nodes[0];

  return redirect(
    getVariantUrlForTreatment({
      pathname: url.pathname,
      handle: product.handle,
      selectedOptions: firstVariant.selectedOptions,
      searchParams: new URLSearchParams(url.search),
    }),
    {
      status: 302,
    },
  );
}

export default function Product() {
  const {product, variants, users} = useLoaderData<typeof loader>();
  const {selectedVariant} = product;
  const [selectedArtist, setSelectedArtist] = useState<
    ProductsGetUsersByVariant | undefined
  >(undefined);

  const onChange = (artist: ProductsGetUsersByVariant) => () => {
    setSelectedArtist(artist);
  };

  return (
    <Stack gap="md">
      <Suspense
        fallback={
          <ProductForm
            product={product}
            selectedVariant={selectedVariant}
            variants={[]}
          />
        }
      >
        <Await
          errorElement="There was a problem loading product variants"
          resolve={variants}
        >
          {(data) => (
            <ProductForm
              product={product}
              selectedVariant={selectedVariant}
              variants={data.product?.variants.nodes || []}
            />
          )}
        </Await>
      </Suspense>
      <Suspense fallback="Henter bruger">
        <Await
          errorElement="There was a problem loading product variants"
          resolve={users}
        >
          {({payload}) => (
            <SimpleGrid cols={{base: 4}}>
              {payload.result.map((user) => (
                <TreatmentPickArtistRadioCard
                  artist={user}
                  checked={selectedArtist?.username === user.username}
                  value={user.username}
                  onChange={onChange(user)}
                  key={user.customerId}
                />
              ))}
            </SimpleGrid>
          )}
        </Await>
      </Suspense>
    </Stack>
  );
}

export const PickArtistCard = ({
  artist,
}: {
  artist: ProductsGetUsersByVariant;
}) => (
  <Paper
    radius="md"
    withBorder
    p="lg"
    bg="var(--mantine-color-body)"
    component={Link}
    to={`/artist/${artist.username}`}
  >
    <Avatar
      src={artist.images?.profile?.url}
      size={240}
      radius={240}
      mx="auto"
    />
    <Text ta="center" fz="lg" fw={500} mt="md" c="black">
      {artist.fullname}
    </Text>
    <Text ta="center" c="dimmed" fz="sm">
      {artist.shortDescription}
    </Text>

    <Button variant="default" fullWidth mt="md">
      Vælge
    </Button>
  </Paper>
);

function ProductPrice({
  selectedVariant,
}: {
  selectedVariant: ProductFragment['selectedVariant'];
}) {
  return (
    <Text size={rem(24)} c="gray" fw={400}>
      {selectedVariant?.compareAtPrice ? (
        <>
          <div className="product-price-on-sale">
            {selectedVariant ? <Money data={selectedVariant.price} /> : null}
            <s>
              <Money data={selectedVariant.compareAtPrice} />
            </s>
          </div>
        </>
      ) : (
        selectedVariant?.price && <Money data={selectedVariant?.price} />
      )}
    </Text>
  );
}

function ProductForm({
  product,
  selectedVariant,
  variants,
}: {
  product: ProductFragment;
  selectedVariant: ProductFragment['selectedVariant'];
  variants: Array<ProductVariantFragment>;
}) {
  return (
    <div className="product-form">
      <VariantSelector
        handle={product.handle}
        options={product.options}
        variants={variants}
        productPath="treatments"
      >
        {({option}) => <ProductOptions key={option.name} option={option} />}
      </VariantSelector>
    </div>
  );
}

function ProductOptions({option}: {option: VariantOption}) {
  const navigate = useNavigate();
  const [active, setActive] = useState<string>();

  const data = option.values.map(
    ({value: label, isAvailable, isActive, to}) => {
      const value = to.indexOf('?') > -1 ? to.substring(to.indexOf('?')) : '';
      return {value, label: label.substring(7), isActive};
    },
  );

  const onChange = (value: string | null) => {
    if (value) {
      navigate(value);
    }
  };

  useEffect(() => {
    const filterData = data.filter((l) => l.isActive);
    if (filterData.length > 0) {
      const isActive = filterData[0];
      setActive(isActive.value);
    }
  }, [data]);

  return (
    active && (
      <Select
        label="Pris"
        placeholder="Pick value"
        data={data}
        defaultValue={active}
        allowDeselect={false}
        onChange={onChange}
      />
    )
  );
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
      {(fetcher: FetcherWithComponents<any>) => (
        <>
          <input
            name="analytics"
            type="hidden"
            value={JSON.stringify(analytics)}
          />
          <Button
            variant="default"
            radius="xl"
            size="lg"
            type="submit"
            onClick={onClick}
            disabled={disabled ?? fetcher.state !== 'idle'}
          >
            {children}
          </Button>
        </>
      )}
    </CartForm>
  );
}

const PRODUCT_VARIANT_FRAGMENT = `#graphql
  fragment ProductVariant on ProductVariant {
    availableForSale
    compareAtPrice {
      amount
      currencyCode
    }
    id
    image {
      __typename
      id
      url
      altText
      width
      height
    }
    price {
      amount
      currencyCode
    }
    product {
      title
      handle
    }
    selectedOptions {
      name
      value
    }
    sku
    title
    unitPrice {
      amount
      currencyCode
    }
  }
` as const;

const PRODUCT_FRAGMENT = `#graphql
  fragment Product on Product {
    id
    title
    vendor
    handle
    descriptionHtml
    description
    options {
      name
      values
    }
    selectedVariant: variantBySelectedOptions(selectedOptions: $selectedOptions) {
      ...ProductVariant
    }
    variants(first: 1) {
      nodes {
        ...ProductVariant
      }
    }
    seo {
      description
      title
    }
  }
  ${PRODUCT_VARIANT_FRAGMENT}
` as const;

const PRODUCT_QUERY = `#graphql
  query Product(
    $country: CountryCode
    $handle: String!
    $language: LanguageCode
    $selectedOptions: [SelectedOptionInput!]!
  ) @inContext(country: $country, language: $language) {
    product(handle: $handle) {
      ...Product
    }
  }
  ${PRODUCT_FRAGMENT}
` as const;

const PRODUCT_VARIANTS_FRAGMENT = `#graphql
  fragment ProductVariants on Product {
    variants(first: 250) {
      nodes {
        ...ProductVariant
      }
    }
  }
  ${PRODUCT_VARIANT_FRAGMENT}
` as const;

const VARIANTS_QUERY = `#graphql
  ${PRODUCT_VARIANTS_FRAGMENT}
  query ProductVariants(
    $country: CountryCode
    $language: LanguageCode
    $handle: String!
  ) @inContext(country: $country, language: $language) {
    product(handle: $handle) {
      ...ProductVariants
    }
  }
` as const;
