import {Link, Outlet, useLoaderData, type MetaFunction} from '@remix-run/react';
import {json, type LoaderFunctionArgs} from '@shopify/remix-oxygen';

import {AspectRatio, Avatar, Button, Flex, rem, Title} from '@mantine/core';
import {Image} from '@shopify/hydrogen';
import type {ProductVariantFragment} from 'storefrontapi.generated';
import {ArtistShell} from '~/components/ArtistShell';
import {redirectToOptions} from '~/components/OptionSelector';
import {LOCATION_FRAGMENT} from '~/graphql/fragments/Location';
import {TREATMENT_OPTION_FRAGMENT} from '~/graphql/fragments/TreatmentOption';
import {USER_METAOBJECT_QUERY} from '~/graphql/fragments/UserMetaobject';

import {UserProvider} from '~/hooks/use-user';
import {useUserMetaobject} from '~/hooks/useUserMetaobject';

export function shouldRevalidate() {
  return false;
}

export const meta: MetaFunction<typeof loader> = ({data}) => {
  return [{title: `BySisters | ${data?.product.title ?? ''}`}];
};

export async function loader({params, request, context}: LoaderFunctionArgs) {
  const {username, productHandle} = params;
  const {storefront} = context;

  if (!productHandle || !username) {
    throw new Response('Expected product handle to be defined', {status: 404});
  }

  const {metaobject: user} = await storefront.query(USER_METAOBJECT_QUERY, {
    variables: {
      username,
    },
  });

  const {product} = await storefront.query(GET_PRODUCT_WITH_OPTIONS, {
    variables: {
      productHandle,
    },
  });

  if (!product) {
    throw new Response('Product handle is wrong', {
      status: 404,
    });
  }

  if (product?.options?.references?.nodes) {
    redirectToOptions({
      productOptions: product?.options?.references?.nodes,
      request,
    });
  }

  return json({product, user});
}

export default function Product() {
  const {product, user} = useLoaderData<typeof loader>();

  const {username, fullname, image} = useUserMetaobject(user);

  return (
    <UserProvider user={user}>
      <ArtistShell>
        <ArtistShell.Header>
          <Flex w="100%" direction="row" justify="space-between">
            <Title order={1} fw="500" fz={{base: 24, sm: 36}} lh={rem(34)}>
              {product.title}
            </Title>
            <Button
              p="0"
              variant="transparent"
              component={Link}
              to={`/artist/${username}`}
              c="black"
              rightSection={<Avatar src={image.image?.url} size="sm" />}
            >
              {fullname}
            </Button>
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

export const TREATMENT_PRODUCT_WITH_OPTIONS_FRAGMENT = `#graphql
  ${TREATMENT_OPTION_FRAGMENT}
  ${LOCATION_FRAGMENT}

  fragment TreatmentProductWithOptions on Product {
    id
    title
    description
    descriptionHtml
    productType
    handle
    featuredImage {
      id
      altText
      url(transform: { maxHeight: 250, maxWidth: 250, crop: CENTER })
      width
      height
    }
    variants(first: 1) {
      nodes {
        compareAtPrice {
          amount
          currencyCode
        }
        price {
          amount
          currencyCode
        }
      }
    }
    parentId: metafield(key: "parentId", namespace: "booking") {
      id
      value
    }
    options: metafield(key: "options", namespace: "booking") {
      references(first: 10) {
        nodes {
          ...TreatmentOption
        }
      }
    }
    scheduleId: metafield(key: "scheduleId", namespace: "booking") {
      id
      value
    }
    locations: metafield(key: "locations", namespace: "booking") {
      references(first: 10) {
        nodes {
          ...Location
        }
      }
    }
    bookingPeriodValue: metafield(key: "booking_period_value", namespace: "booking") {
      id
      value
    }
    bookingPeriodUnit: metafield(key: "booking_period_unit", namespace: "booking") {
      id
      value
    }
    noticePeriodValue: metafield(key: "notice_period_value", namespace: "booking") {
      id
      value
    }
    noticePeriodUnit: metafield(key: "notice_period_unit", namespace: "booking") {
      id
      value
    }
    duration: metafield(key: "duration", namespace: "booking") {
      id
      value
    }
    breaktime: metafield(key: "breaktime", namespace: "booking") {
      id
      value
    }
  }
` as const;

export const GET_PRODUCT_WITH_OPTIONS = `#graphql
  ${TREATMENT_PRODUCT_WITH_OPTIONS_FRAGMENT}
  query ArtistOptions(
    $productHandle: String!
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    product(handle: $productHandle) {
      ...TreatmentProductWithOptions
    }
  }
` as const;
