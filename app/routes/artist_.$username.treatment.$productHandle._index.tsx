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
import {Money} from '@shopify/hydrogen';
import {ArtistShell} from '~/components/ArtistShell';
import {
  OptionSelector,
  ProductOption,
  redirectToOptions,
  useCalculateDurationAndPrice,
} from '~/components/OptionSelector';
import {TreatmentStepper} from '~/components/TreatmentStepper';

import {ArtistTreatmentOptions} from '~/graphql/artist/ArtistTreatmentOptions';
import {durationToTime} from '~/lib/duration';
import type {loader as rootLoader} from './artist_.$username.treatment.$productHandle';

export function shouldRevalidate() {
  return false;
}

export async function loader({params, request, context}: LoaderFunctionArgs) {
  const {productHandle} = params;
  const {storefront} = context;

  if (!productHandle) {
    throw new Response('Expected product and username handle to be defined', {
      status: 404,
    });
  }

  const {products: productOptions} = await storefront.query(
    ArtistTreatmentOptions,
    {
      variables: {
        query: `tag:'parent-${productHandle}' AND tag:'options'`,
        country: storefront.i18n.country,
        language: storefront.i18n.language,
      },
    },
  );

  if (productOptions.nodes.length > 0) {
    redirectToOptions({
      productOptions: productOptions.nodes,
      request,
    });
  }

  return json({
    productOptions,
  });
}

export default function ProductDescription() {
  const [searchParams] = useSearchParams();

  const {product} = useOutletContext<SerializeFrom<typeof rootLoader>>();
  const {productOptions} = useLoaderData<typeof loader>();

  const {totalDuration, totalPrice} = useCalculateDurationAndPrice({
    parentId: product.id,
    productOptions: productOptions.nodes,
    currentPrice: parseInt(product.variants.nodes[0]?.price.amount || '0'),
    currentDuration: parseInt(product.duration?.value || '0'),
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
        {productOptions.nodes.length > 0 ? (
          <>
            {productOptions.nodes.map((productWithVariants) => {
              return (
                <OptionSelector
                  key={productWithVariants.id}
                  productWithVariants={productWithVariants}
                >
                  {(props) => {
                    return <ProductOption {...props} />;
                  }}
                </OptionSelector>
              );
            })}
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
