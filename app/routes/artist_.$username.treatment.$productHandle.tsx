import {Link, Outlet, useLoaderData, type MetaFunction} from '@remix-run/react';
import {json, type LoaderFunctionArgs} from '@shopify/remix-oxygen';

import {AspectRatio, Avatar, Button, Flex, Title} from '@mantine/core';
import {Image} from '@shopify/hydrogen';
import {IconArrowLeft} from '@tabler/icons-react';
import type {ProductVariantFragment} from 'storefrontapi.generated';
import {ArtistShell} from '~/components/ArtistShell';
import {ArtistTreatment} from '~/graphql/artist/ArtistTreatment';
import {ArtistUser} from '~/graphql/artist/ArtistUser';
import {UserProvider} from '~/hooks/use-user';
import {useUserMetaobject} from '~/hooks/useUserMetaobject';

export function shouldRevalidate() {
  return false;
}

export const meta: MetaFunction<typeof loader> = ({data}) => {
  return [{title: `BySisters | ${data?.product.title ?? ''}`}];
};

export async function loader({params, context}: LoaderFunctionArgs) {
  const {username, productHandle} = params;
  const {storefront} = context;

  if (!productHandle || !username) {
    throw new Response('Expected product handle to be defined', {status: 404});
  }

  const {metaobject: user} = await storefront.query(ArtistUser, {
    variables: {
      username,
    },
  });

  const {product} = await storefront.query(ArtistTreatment, {
    variables: {
      productHandle,
    },
  });

  if (!product) {
    throw new Response('Product handle is wrong', {
      status: 404,
    });
  }

  return json({product, user});
}

export default function Product() {
  const {product, user} = useLoaderData<typeof loader>();

  const {username, fullname, active, shortDescription, image, theme} =
    useUserMetaobject(user);

  return (
    <UserProvider user={user}>
      <ArtistShell>
        <ArtistShell.Header>
          <Flex
            direction="column"
            gap={{base: 'xs', sm: '0'}}
            w="100%"
            align="flex-start"
          >
            <Button
              p="0"
              variant="transparent"
              component={Link}
              to={`/artist/${username}`}
              c="black"
              leftSection={
                <IconArrowLeft
                  style={{width: '24px', height: '24px'}}
                  stroke={1.5}
                />
              }
              rightSection={<Avatar src={image.image?.url} size="md" />}
            >
              {fullname}
            </Button>
            <Flex justify="space-between" align="center" w="100%">
              <Title order={1} fw="500" fz={{base: 24, sm: 36}}>
                {product.title}
              </Title>
            </Flex>
          </Flex>
        </ArtistShell.Header>

        <Outlet context={{product, user}} />
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
