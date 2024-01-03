import {
  defer,
  type LoaderFunctionArgs,
  type MetaFunction,
} from '@shopify/remix-oxygen';

import {
  Await,
  useLoaderData,
  useNavigate,
  useSearchParams,
} from '@remix-run/react';
import {getSelectedProductOptions, Image, parseGid} from '@shopify/hydrogen';
import {Suspense} from 'react';
import type {
  ProductFragment,
  ProductVariantFragment,
} from 'storefrontapi.generated';
import {PRODUCT_SELECTED_OPTIONS_QUERY, VARIANTS_QUERY} from '~/data/queries';
import {getBookingShopifyApi} from '~/lib/api/bookingShopifyApi';

import {
  AspectRatio,
  Box,
  Group,
  rem,
  Select,
  SimpleGrid,
  Skeleton,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import {VariantSelector, type VariantOption} from '@shopify/hydrogen';
import {BadgeCollection} from '~/components/BadgeCollection';
import {TreatmentPickArtistRadioCard} from '~/components/treatment/TreatmentPickArtistRadioCard';
import {type ProductsGetUsersByVariant} from '~/lib/api/model';

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
      !option.name.startsWith('fbclid'),
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

  if (!product.selectedVariant) {
    const firstVariant = product.variants.nodes[0];
    product.selectedVariant = firstVariant;
  }

  const variants = storefront.query(VARIANTS_QUERY, {
    variables: {handle: productHandle},
  });

  return defer({product, variantsUsers: Promise.all([variants, users])});
}

export default function Product() {
  const {product, variantsUsers} = useLoaderData<typeof loader>();

  const collection = product.collections.nodes.find((p) =>
    p.title.includes('treatments'),
  );

  return (
    <>
      <SimpleGrid cols={{base: 1, md: 2}} spacing={0}>
        <ProductImage image={product.selectedVariant?.image} />
        <Box p={{base: rem(10), md: rem(42)}} bg="#fafafb">
          <BadgeCollection collection={collection} linkBack />
          <Group my="xs" justify="space-between">
            <Title order={1}>{product?.title}</Title>
          </Group>

          <Text
            size="xl"
            c="dimmed"
            fw={400}
            dangerouslySetInnerHTML={{__html: product.descriptionHtml}}
          ></Text>

          <Stack gap="md">
            <Suspense fallback={<Skeleton height="50" />}>
              <Await
                errorElement="There was a problem loading..."
                resolve={variantsUsers}
              >
                {([data, users]) => (
                  <>
                    <ProductForm
                      product={product}
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
    </>
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
  return (
    <div>
      <Text mb={rem(2)}>Skønhedsekspert</Text>
      {users.length > 0 ? (
        <SimpleGrid cols={{base: 2, sm: 3}}>
          {users.map((user) => {
            const variant = variants.find(
              (v) => parseGid(v.id).id === user.variantId.toString(),
            );

            return (
              <TreatmentPickArtistRadioCard
                artist={user}
                key={user.customerId}
                variant={variant}
              />
            );
          })}
        </SimpleGrid>
      ) : (
        <Text fw="500">Ingen skønhedseksperter til den pågældende pris.</Text>
      )}
    </div>
  );
}

function ProductForm({
  product,
  variants,
}: {
  product: ProductFragment;
  variants: Array<ProductVariantFragment>;
}) {
  return (
    <VariantSelector
      handle={product.handle}
      options={product.options}
      variants={variants}
      productPath="treatments"
    >
      {({option}) => <ProductOptions key={option.name} option={option} />}
    </VariantSelector>
  );
}

function ProductOptions({option}: {option: VariantOption}) {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const data = option.values.map(
    ({value: label, isAvailable, isActive, to}) => {
      const value = to.indexOf('?') > -1 ? to.substring(to.indexOf('?')) : '';
      return {value, label: label.substring(7)};
    },
  );
  const onChange = (value: string | null) => {
    if (value) {
      navigate(value);
    }
  };

  const onClearable = () => {
    setSearchParams([], {
      state: {
        key: 'booking',
      },
    });
  };

  const active = searchParams.get('Pris');

  return (
    <Select
      label="Pris"
      placeholder="Filtre pris"
      data={data}
      value={active ? `?Pris=${active.replace(' ', '+')}` : ''}
      allowDeselect={false}
      onChange={onChange}
      clearable
      clearButtonProps={{onClick: onClearable}}
    />
  );
}
