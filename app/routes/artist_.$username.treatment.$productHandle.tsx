import {Link, Outlet, useLoaderData, type MetaFunction} from '@remix-run/react';
import {json, type LoaderFunctionArgs} from '@shopify/remix-oxygen';

import {AspectRatio, Avatar, Button, Flex, Stack, Title} from '@mantine/core';
import {Image, type Storefront} from '@shopify/hydrogen';
import {IconArrowLeft} from '@tabler/icons-react';
import {type ProductVariantFragment} from 'storefrontapi.generated';
import {ArtistShell} from '~/components/ArtistShell';
import {PRODUCT_SELECTED_OPTIONS_QUERY} from '~/data/queries';
import {UserProvider} from '~/hooks/use-user';
import {getBookingShopifyApi} from '~/lib/api/bookingShopifyApi';

export const meta: MetaFunction<typeof loader> = ({data}) => {
  return [{title: `BySisters | ${data?.product.title ?? ''}`}];
};

export function shouldRevalidate() {
  return false;
}

async function getProduct({
  storefront,
  username,
  productHandle,
}: {
  storefront: Storefront<I18nLocale>;
  username: string;
  productHandle: string;
}) {
  const {payload: userProduct} = await getBookingShopifyApi().userProductGet(
    username,
    productHandle,
  );

  if (!productHandle || !userProduct.selectedOptions) {
    throw new Error('productHandle and selectedOptions must be provided');
  }

  return storefront.query(PRODUCT_SELECTED_OPTIONS_QUERY, {
    variables: {
      productHandle,
      selectedOptions: userProduct.selectedOptions,
    },
  });
}

export async function loader({params, request, context}: LoaderFunctionArgs) {
  const {username, productHandle} = params;
  const {storefront} = context;

  if (!productHandle || !username) {
    throw new Response('Expected product handle to be defined', {status: 404});
  }

  const {payload: artist} = await getBookingShopifyApi().userGet(username);

  const {product} = await getProduct({storefront, username, productHandle});

  if (!product) {
    throw new Response('Product handle is wrong', {
      status: 404,
    });
  }

  return json({product, artist});
}

export default function Product() {
  const {product, artist} = useLoaderData<typeof loader>();

  return (
    <UserProvider user={artist}>
      <ArtistShell>
        <ArtistShell.Header>
          <Stack gap="xs" w="100%" align="flex-start">
            <Button
              p="0"
              variant="transparent"
              component={Link}
              to={`/artist/${artist.username}`}
              c="black"
              leftSection={
                <IconArrowLeft
                  style={{width: '24px', height: '24px'}}
                  stroke={1.5}
                />
              }
              rightSection={
                <Avatar src={artist.images?.profile?.url} size="md" />
              }
            >
              {artist.fullname}
            </Button>

            <Flex justify="space-between" align="center" w="100%">
              <Title order={1} fw="500" fz={{base: 24, sm: 40}}>
                {product.title}
              </Title>
            </Flex>
          </Stack>
        </ArtistShell.Header>

        <Outlet context={{product}} />
      </ArtistShell>
    </UserProvider>
  );
}

export function ProductImage({
  image,
}: {
  image: ProductVariantFragment['image'];
}) {
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