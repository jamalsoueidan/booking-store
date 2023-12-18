import {
  defer,
  redirect,
  type LoaderFunctionArgs,
  type MetaFunction,
} from '@shopify/remix-oxygen';

import {
  Await,
  useLoaderData,
  useNavigate,
  useSearchParams,
  type ShouldRevalidateFunctionArgs,
} from '@remix-run/react';
import {getSelectedProductOptions, Image, parseGid} from '@shopify/hydrogen';
import {Suspense, useEffect, useState} from 'react';
import type {
  ProductFragment,
  ProductVariantFragment,
} from 'storefrontapi.generated';
import {PRODUCT_SELECTED_OPTIONS_QUERY, VARIANTS_QUERY} from '~/data/queries';
import {getBookingShopifyApi} from '~/lib/api/bookingShopifyApi';

import {
  AspectRatio,
  Box,
  rem,
  Select,
  SimpleGrid,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import {VariantSelector, type VariantOption} from '@shopify/hydrogen';
import type {SelectedOption} from '@shopify/hydrogen/storefront-api-types';
import {TreatmentPickArtistRadioCard} from '~/components/treatment/TreatmentPickArtistRadioCard';
import {type ProductsGetUsersByVariant} from '~/lib/api/model';
import {getVariantUrlForTreatment} from '~/utils';

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

export const meta: MetaFunction<typeof loader> = ({data}) => {
  return [{title: `BySisters | ${data?.product.title ?? ''}`}];
};

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
  } else {
    // if no selected variant was returned from the selected options,
    // we redirect to the first variant's url with it's selected options applied
    if (!product.selectedVariant) {
      throw redirectToFirstVariant({product, request});
    }
  }

  // In order to show which variants are available in the UI, we need to query
  // all of them. But there might be a *lot*, so instead separate the variants
  // into it's own separate query that is deferred. So there's a brief moment
  // where variant options might show as available when they're not, but after
  // this deffered query resolves, the UI will update.
  const variants = storefront.query(VARIANTS_QUERY, {
    variables: {handle: productHandle},
  });

  return defer({product, variantsUsers: Promise.all([variants, users])});
}

export default function Product() {
  const {product, variantsUsers} = useLoaderData<typeof loader>();
  const {selectedVariant} = product;

  return (
    <SimpleGrid cols={{base: 1, md: 2}} spacing={0}>
      <ProductImage image={selectedVariant?.image} />
      <Box p={{base: rem(10), md: rem(42)}} bg="#fafafb">
        <Box mb="md">
          <Title order={1}>{product?.title}</Title>
        </Box>

        <Text
          size="xl"
          c="dimmed"
          fw={400}
          dangerouslySetInnerHTML={{__html: product.descriptionHtml}}
        ></Text>

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
      </Box>
    </SimpleGrid>
  );
}

function ProductImage({image}: {image: ProductVariantFragment['image']}) {
  if (!image) {
    return <div className="product-image" />;
  }
  return (
    <AspectRatio ratio={1080 / 1080}>
      <Image
        alt={image.altText || 'Product Image'}
        aspectRatio="1/1"
        data={image}
        key={image.id}
        sizes="(min-width: 45em) 50vw, 100vw"
      />
    </AspectRatio>
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
    const newSearchParams = new URLSearchParams();
    newSearchParams.set('username', artist.username);
    setSearchParams(newSearchParams, {
      state: {
        key: 'booking',
      },
    });
  };

  const username = searchParams.get('username');

  return (
    <div>
      <Text mb={rem(2)}>Skønhedsekspert</Text>
      <SimpleGrid cols={{base: 2, sm: 3}}>
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
    </div>
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

export function redirectToFirstVariant({
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
