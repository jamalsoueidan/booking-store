import {Link, Outlet, useLoaderData, type MetaFunction} from '@remix-run/react';
import {json, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import type {ProductVariantFragment} from 'storefrontapi.generated';

import {
  Anchor,
  AspectRatio,
  Avatar,
  Badge,
  Box,
  Card,
  Container,
  Divider,
  Flex,
  Group,
  Stack,
  Text,
  Title,
  rem,
} from '@mantine/core';
import {useMediaQuery} from '@mantine/hooks';
import {Image, Money} from '@shopify/hydrogen';
import {IconArrowLeft, IconClockHour4} from '@tabler/icons-react';
import {TreatmentStepper} from '~/components/TreatmentStepper';
import {PRODUCT_SELECTED_OPTIONS_QUERY} from '~/data/queries';
import {getBookingShopifyApi} from '~/lib/api/bookingShopifyApi';
import {durationToTime} from '~/lib/duration';

export const meta: MetaFunction<typeof loader> = ({data}) => {
  return [{title: `BySisters | ${data?.product.title ?? ''}`}];
};

export function shouldRevalidate() {
  return false;
}

export async function loader({params, request, context}: LoaderFunctionArgs) {
  const {username, productHandle} = params;
  const {storefront} = context;

  if (!productHandle || !username) {
    throw new Response('Expected product handle to be defined', {status: 404});
  }

  try {
    const {payload: userProduct} = await getBookingShopifyApi().userProductGet(
      username,
      productHandle,
    );

    const {payload: artist} = await getBookingShopifyApi().userGet(username);

    const {product} = await storefront.query(PRODUCT_SELECTED_OPTIONS_QUERY, {
      variables: {
        productHandle,
        selectedOptions: userProduct.selectedOptions,
      },
    });

    if (!product) {
      throw new Response('Product handle is wrong', {
        status: 404,
      });
    }

    return json({product, artist, userProduct});
  } catch (err) {
    throw new Response('Username or product handle is wrong', {status: 404});
  }
}

export default function Product() {
  const {product, artist, userProduct} = useLoaderData<typeof loader>();
  const isMobile = useMediaQuery('(max-width: 62em)');

  const paths = [
    {
      title: '',
      path: '',
    },
    {
      title: 'Lokation',
      path: 'pick-location',
      required: ['locationId'],
      text: 'Vælge en lokation før du kan forsætte...',
    },
    {
      title: 'Flere behandlinger',
      path: 'pick-more',
    },
    {
      title: 'Dato & Tid',
      path: 'pick-datetime',
      required: ['fromDate', 'toDate'],
      text: 'Vælge en tid før du kan forsætte...',
    },
    {
      title: 'Køb',
      path: 'completed',
    },
  ];

  return (
    <div
      style={{
        backgroundColor: 'rgb(168, 139, 248)',
        paddingTop: rem(isMobile ? 0 : 60),
      }}
    >
      <Container size={isMobile ? '100%' : 'sm'} p={0}>
        <Card
          radius={isMobile ? 0 : '25px 25px 0 0'}
          withBorder={!isMobile}
          p={isMobile ? 'sm' : 'md'}
          mih={`calc(100vh - ${isMobile ? 58 : 144}px)`}
        >
          <Card.Section bg="rgba(168, 139, 248, 0.2)">
            <Stack gap={isMobile ? 'xs' : 'sm'} p={rem(isMobile ? 16 : 28)}>
              <Anchor
                component={Link}
                to={`/artist/${artist.username}`}
                c="black"
                underline="never"
              >
                <Group gap={isMobile ? '2px' : 'xs'}>
                  <IconArrowLeft
                    style={{width: '24px', height: '24px'}}
                    stroke={1.5}
                  />
                  <Text>{artist.fullname}</Text>
                </Group>
              </Anchor>

              <Flex justify="space-between" align="center">
                <Title order={1} mb="xs" size={rem(isMobile ? 24 : 32)}>
                  {product?.title}
                </Title>

                <Avatar
                  src={artist.images?.profile?.url}
                  size="xl"
                  radius="100%"
                />
              </Flex>
            </Stack>
          </Card.Section>
          <Card.Section>
            <Flex justify="space-between">
              <Box p="md">
                {product.selectedVariant?.price && (
                  <Badge
                    variant="outline"
                    color="#ebeaeb"
                    size="lg"
                    bg="#f7f7f7"
                    fz="sm"
                    c="black"
                    py="sm"
                  >
                    <Money data={product.selectedVariant?.price} />
                  </Badge>
                )}
              </Box>
              <Divider orientation="vertical" />
              <Group gap="xs" p="md">
                <IconClockHour4 />
                <Text>{durationToTime(userProduct?.duration ?? 0)}</Text>
              </Group>
            </Flex>
            <Divider />
          </Card.Section>

          <Outlet context={{product}} />
        </Card>

        <TreatmentStepper paths={paths} />
      </Container>
    </div>
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
