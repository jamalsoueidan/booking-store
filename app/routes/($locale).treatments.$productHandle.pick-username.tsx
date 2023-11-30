import {
  Await,
  useLoaderData,
  useNavigate,
  useSearchParams,
  type FetcherWithComponents,
  type MetaFunction,
  type ShouldRevalidateFunctionArgs,
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
import {PRODUCT_SELECTED_OPTIONS_QUERY, VARIANTS_QUERY} from '~/data/queries';
import {getBookingShopifyApi} from '~/lib/api/bookingShopifyApi';
import {type ProductsGetUsersByVariant} from '~/lib/api/model';

export const meta: MetaFunction<typeof loader> = ({data}) => {
  return [{title: `BySisters | ${data?.product.title ?? ''}`}];
};

export function shouldRevalidate({
  currentUrl,
  nextUrl,
}: ShouldRevalidateFunctionArgs) {
  const currentSearchParams = currentUrl.searchParams;
  const nextSearchParams = nextUrl.searchParams;

  const currentParamsCopy = new URLSearchParams(currentSearchParams);
  const nextParamsCopy = new URLSearchParams(nextSearchParams);

  currentParamsCopy.delete('username');
  nextParamsCopy.delete('username');

  return currentParamsCopy.toString() !== nextParamsCopy.toString();
}

export async function loader({params, request, context}: LoaderFunctionArgs) {
  const {productHandle} = params;
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
      !option.name.startsWith('username'),
  );

  if (!productHandle) {
    throw new Error('Expected product handle to be defined');
  }

  // await the query for the critical product data
  const {product} = await storefront.query(PRODUCT_SELECTED_OPTIONS_QUERY, {
    variables: {productHandle, selectedOptions},
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
    variables: {handle: productHandle},
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
    newSearchParams.set('username', artist.username);
    setSearchParams(newSearchParams);
  };

  const username = searchParams.get('username');

  return (
    <SimpleGrid cols={{base: 4}}>
      {users.map((user) => {
        const variant = variants.find(
          (v) => parseGid(v.id).id === user.variantId.toString(),
        );
        return (
          <TreatmentPickArtistRadioCard
            artist={user}
            checked={username === user.username}
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
  const [_, setSearchParams] = useSearchParams();
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

  const onClearable = () => {
    setSearchParams([]);
  };

  useEffect(() => {
    const filterData = data.filter(
      (l) => l.label === selectedVariant?.title.substring(7),
    );

    if (filterData.length > 0) {
      const isActive = filterData[0];
      setActive(isActive.value);
    } else {
      setActive(undefined);
    }
  }, [data, selectedVariant]);

  return (
    <Select
      label="Pris"
      placeholder="Filtre pris"
      data={data}
      value={active}
      allowDeselect={false}
      onChange={onChange}
      clearable
      clearButtonProps={{onClick: onClearable}}
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
