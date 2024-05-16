import {
  json,
  type LoaderFunctionArgs,
  type MetaFunction,
} from '@shopify/remix-oxygen';

import {Link, useLoaderData} from '@remix-run/react';
import {UNSTABLE_Analytics as Analytics} from '@shopify/hydrogen';

import {
  AspectRatio,
  Box,
  Card,
  Group,
  Image,
  rem,
  SimpleGrid,
  Stack,
  Text,
  Title,
} from '@mantine/core';

import {type TreatmentUserFragment} from 'storefrontapi.generated';
import {PriceBadge} from '~/components/artist/PriceBadge';
import {TreatmentCollectionFragment} from '~/graphql/fragments/TreatmentCollection';
import {useUserMetaobject} from '~/hooks/useUserMetaobject';

export const meta: MetaFunction<typeof loader> = ({data}) => {
  return [{title: `BySisters | ${data?.product.title ?? ''}`}];
};

export async function loader({params, context}: LoaderFunctionArgs) {
  const {productHandle} = params;
  const {storefront} = context;

  if (!productHandle) {
    throw new Error('Expected product handle to be defined');
  }

  const {product} = await storefront.query(Treatment, {
    variables: {
      productHandle,
    },
  });

  if (!product) {
    throw new Response(null, {status: 404});
  }

  return json({product});
}

export default function Product() {
  const {product} = useLoaderData<typeof loader>();

  return (
    <>
      <SimpleGrid cols={{base: 1, md: 2}} spacing={0}>
        <ProductImage image={product.featuredImage} />
        <Box
          py={{base: rem(30), md: rem(86)}}
          px={{base: rem(10), md: rem(42)}}
          bg="#fafafb"
        >
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
            <div>
              <Text mb={rem(2)}>Skønhedsekspert</Text>
              {product.collection?.reference?.products ? (
                <SimpleGrid cols={{base: 2, sm: 3}}>
                  {product.collection.reference.products.nodes.map(
                    (product) => (
                      <TreatmentProductUser
                        key={product.id}
                        product={product}
                      />
                    ),
                  )}
                </SimpleGrid>
              ) : (
                <Text fw="500">
                  Ingen skønhedseksperter til den pågældende pris.
                </Text>
              )}
            </div>
          </Stack>
        </Box>
        <Analytics.ProductView
          data={{
            products: [
              {
                id: product.id,
                title: product.title,
                price: product.variants.nodes[0].price.amount || '0',
                vendor: product.vendor,
                variantId: product.variants.nodes[0].id || '',
                variantTitle: product.title || '',
                quantity: 1,
              },
            ],
          }}
        />
      </SimpleGrid>
    </>
  );
}

function ProductImage({image}: {image: any}) {
  if (!image) {
    return <div className="product-image" />;
  }
  return (
    <AspectRatio ratio={1080 / 1080}>
      <Image alt={image.altText || 'Product Image'} src={image.url} h="100%" />
    </AspectRatio>
  );
}

function TreatmentProductUser({product}: {product: TreatmentUserFragment}) {
  const {username, fullname, image} = useUserMetaobject(
    product.user?.reference,
  );

  const variant = product.variants.nodes[0];

  return (
    <Card
      withBorder
      component={Link}
      to={`/artist/${username}/treatment/${product.handle}`}
    >
      <Stack gap="3" justify="center" align="center">
        <AspectRatio ratio={1 / 1}>
          <Image src={image.image?.url!} loading="eager" mah={160} />
        </AspectRatio>
        <Text tt="uppercase" c="dimmed" fw={700} size="md">
          {fullname}
        </Text>

        {variant.price && (
          <PriceBadge
            size="sm"
            variant={undefined}
            color={undefined}
            price={variant.price}
            compareAtPrice={variant.compareAtPrice}
          />
        )}
      </Stack>
    </Card>
  );
}

export const Treatment = `#graphql
  ${TreatmentCollectionFragment}

  query Treatment(
    $productHandle: String!
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    product(handle: $productHandle) {
      ...TreatmentCollection
    }
  }
` as const;
