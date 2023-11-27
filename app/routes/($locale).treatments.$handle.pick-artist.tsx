import {
  Await,
  useLoaderData,
  useNavigate,
  useSearchParams,
  type FetcherWithComponents,
  type MetaFunction,
} from '@remix-run/react';
import {defer, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {Suspense, useEffect, useState} from 'react';
import type {
  ProductFragment,
  ProductVariantFragment,
} from 'storefrontapi.generated';

import {
  ActionIcon,
  Button,
  Popover,
  Select,
  SimpleGrid,
  Stack,
} from '@mantine/core';
import {
  CartForm,
  VariantSelector,
  getSelectedProductOptions,
  parseGid,
  type VariantOption,
} from '@shopify/hydrogen';
import type {
  CartLineInput,
  SelectedOption,
} from '@shopify/hydrogen/storefront-api-types';
import {IconAdjustments} from '@tabler/icons-react';
import {TreatmentPickArtistRadioCard} from '~/components/treatment/TreatmentPickArtistRadioCard';
import {getBookingShopifyApi} from '~/lib/api/bookingShopifyApi';
import {type ProductsGetUsersByVariant} from '~/lib/api/model';

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
      !option.name.startsWith('fbclid') &&
      !option.name.startsWith('artist'),
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

  const users = getBookingShopifyApi().productsGetUsersByVariant({
    productId: parseGid(product.id).id,
    ...(product.selectedVariant
      ? {variantId: parseGid(product.selectedVariant.id).id}
      : {}),
  });

  const firstVariant = product.variants.nodes[0];
  const firstVariantIsDefault = Boolean(
    firstVariant.selectedOptions.find(
      (option: SelectedOption) =>
        option.name === 'Title' && option.value === 'Default Title',
    ),
  );

  if (firstVariantIsDefault) {
    product.selectedVariant = firstVariant;
  }

  const variants = storefront.query(VARIANTS_QUERY, {
    variables: {handle},
  });

  return defer({product, variantsUsers: Promise.all([variants, users])});
}

export default function Product() {
  const {product, variantsUsers} = useLoaderData<typeof loader>();
  const {selectedVariant} = product;

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
          errorElement="There was a problem loading..."
          resolve={variantsUsers}
        >
          {([data, users]) => (
            <>
              <ProductForm
                product={product}
                selectedVariant={selectedVariant}
                variants={data.product?.variants.nodes || []}
              />
              <PickArtistsForm
                users={users.payload.result}
                variants={data.product?.variants.nodes || []}
              />
            </>
          )}
        </Await>
      </Suspense>
    </Stack>
  );
}

function PickArtistsForm({
  users,
  variants,
}: {
  users: ProductsGetUsersByVariant[];
  variants: Array<ProductVariantFragment>;
}) {
  const [searchParams, setSearchParams] = useSearchParams();

  const onChange = (artist: ProductsGetUsersByVariant) => () => {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set('artist', artist.username);
    setSearchParams(newSearchParams);
  };

  return (
    <SimpleGrid cols={{base: 4}}>
      {users.map((user) => {
        const variant = variants.find(
          (v) => parseGid(v.id).id === user.variantId.toString(),
        );
        return (
          <TreatmentPickArtistRadioCard
            artist={user}
            checked={searchParams.get('artist') === user.username}
            value={user.username}
            onChange={onChange(user)}
            key={user.customerId}
            variant={variant}
          />
        );
      })}
    </SimpleGrid>
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
    <div style={{position: 'absolute', right: 20, top: 0}}>
      <Popover width={300} trapFocus position="bottom" withArrow shadow="md">
        <Popover.Target>
          <ActionIcon variant="light" size="lg" aria-label="Search">
            <IconAdjustments
              style={{width: '70%', height: '70%', transform: 'rotate(90deg)'}}
              stroke={1.5}
            />
          </ActionIcon>
        </Popover.Target>
        <Popover.Dropdown>
          <VariantSelector
            handle={product.handle}
            options={product.options}
            variants={variants}
            productPath="treatments"
          >
            {({option}) => (
              <ProductOptions
                key={option.name}
                option={option}
                selectedVariant={selectedVariant}
              />
            )}
          </VariantSelector>
        </Popover.Dropdown>
      </Popover>
    </div>
  );
}

function ProductOptions({
  option,
  selectedVariant,
}: {
  option: VariantOption;
  selectedVariant: ProductFragment['selectedVariant'];
}) {
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
    <Select
      label="Pris"
      placeholder="Filtre pris"
      data={data}
      defaultValue={active}
      allowDeselect={false}
      onChange={onChange}
    />
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
