import {Button, Divider, Text} from '@mantine/core';
import {
  Link,
  useLoaderData,
  useOutletContext,
  useSearchParams,
} from '@remix-run/react';
import {
  json,
  type LoaderFunctionArgs,
  type SerializeFrom,
} from '@remix-run/server-runtime';
import {Money, parseGid} from '@shopify/hydrogen';
import {ArtistShell} from '~/components/ArtistShell';
import {
  OptionSelector,
  ProductOption,
  redirectToOptions,
  useCalculateDurationAndPrice,
} from '~/components/OptionSelector';
import {TreatmentStepper} from '~/components/TreatmentStepper';

import {ArtistTreatment} from '~/graphql/artist/ArtistTreatment';
import {ArtistTreatmentIndex} from '~/graphql/artist/ArtistTreatmentIndex';
import {durationToTime} from '~/lib/duration';
import type {loader as rootLoader} from './artist_.$username.treatment.$productHandle';

export function shouldRevalidate() {
  return false;
}

export async function loader({params, request, context}: LoaderFunctionArgs) {
  const {username, productHandle} = params;
  const {storefront} = context;

  if (!productHandle || !username) {
    throw new Response('Expected product and username handle to be defined', {
      status: 404,
    });
  }

  const {product} = await storefront.query(ArtistTreatment, {
    variables: {
      productHandle,
      country: storefront.i18n.country,
      language: storefront.i18n.language,
    },
  });

  if (!product) {
    throw new Response('product cant be found', {
      status: 404,
    });
  }

  const {products: allProductOptionsWithVariants} = await storefront.query(
    ArtistTreatmentIndex,
    {
      variables: {
        query: `tag:'product-${productHandle}' AND tag:'user-${username}'`,
        country: storefront.i18n.country,
        language: storefront.i18n.language,
      },
    },
  );

  if (allProductOptionsWithVariants.nodes.length > 0) {
    redirectToOptions({
      parentId: parseGid(product?.id).id,
      allProductOptionsWithVariants: allProductOptionsWithVariants.nodes,
      request,
    });
  }

  return json({
    allProductOptionsWithVariants,
  });
}

export default function ProductDescription() {
  const [searchParams] = useSearchParams();

  const {product, userProduct} =
    useOutletContext<SerializeFrom<typeof rootLoader>>();
  const {allProductOptionsWithVariants} = useLoaderData<typeof loader>();

  const {totalDuration, totalPrice} = useCalculateDurationAndPrice({
    parentId: product.id,
    allProductOptionsWithVariants: allProductOptionsWithVariants.nodes,
    currentPrice: parseInt(product.selectedVariant?.price.amount || '0'),
    currentDuration: userProduct.duration,
  });

  return (
    <>
      <ArtistShell.Main>
        <Text
          size="lg"
          c="dimmed"
          fw={400}
          dangerouslySetInnerHTML={{__html: product.descriptionHtml}}
        ></Text>
        <Divider />
        {allProductOptionsWithVariants.nodes.length > 0 ? (
          <>
            {allProductOptionsWithVariants.nodes.map(
              (productOptionWithVariants) => {
                return (
                  <OptionSelector
                    key={productOptionWithVariants.id}
                    parentId={parseGid(product.id).id}
                    productOptionWithVariants={productOptionWithVariants}
                  >
                    {(props) => {
                      return <ProductOption {...props} />;
                    }}
                  </OptionSelector>
                );
              },
            )}
            <Divider mb="md" />
            <Text>
              Total pris:{' '}
              <Money
                as="span"
                data={{
                  __typename: 'MoneyV2',
                  amount: totalPrice.toString(),
                  currencyCode: 'DKK',
                }}
              />
            </Text>
            Total tid: {durationToTime(totalDuration ?? 0)}
          </>
        ) : null}
      </ArtistShell.Main>
      <ArtistShell.Footer>
        <TreatmentStepper>
          <Button
            variant="default"
            component={Link}
            to={`pick-location?${searchParams.toString()}`}
            relative="route"
          >
            Bestil tid
          </Button>
        </TreatmentStepper>
      </ArtistShell.Footer>
    </>
  );
}
