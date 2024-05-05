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
import {useMemo} from 'react';
import {ArtistShell} from '~/components/ArtistShell';
import {
  OptionSelector,
  ProductOption,
  redirectToOptions,
  usePickedOptionsToCalculateDuration,
  usePickedVariantsToCalculateTotalPrice,
} from '~/components/OptionSelector';
import {TreatmentStepper} from '~/components/TreatmentStepper';
import {ArtistTreatmentIndex} from '~/graphql/storefront/ArtistTreatmentIndex';
import {getBookingShopifyApi} from '~/lib/api/bookingShopifyApi';
import {durationToTime} from '~/lib/duration';
import {matchesGid} from '~/lib/matches-gid';
import type {loader as rootLoader} from './artist_.$username.treatment.$productHandle';

export async function loader({params, request, context}: LoaderFunctionArgs) {
  const {username, productHandle} = params;
  const {storefront} = context;

  if (!productHandle || !username) {
    throw new Response('Expected product handle to be defined', {status: 404});
  }

  const {payload: userProduct} = await getBookingShopifyApi().userProductGet(
    username,
    productHandle,
  );

  if (!productHandle || !userProduct.selectedOptions) {
    throw new Error('productHandle and selectedOptions must be provided');
  }

  const productIds = userProduct.options?.map((p) => p.productId) || [];

  const {products: allProductOptionsWithVariants} = await storefront.query(
    ArtistTreatmentIndex,
    {
      variables: {
        query: productIds.length > 0 ? productIds.join(' OR ') : 'tag:"-"',
        country: storefront.i18n.country,
        language: storefront.i18n.language,
      },
    },
  );

  if (allProductOptionsWithVariants.nodes.length > 0) {
    redirectToOptions({
      parentId: userProduct.productId,
      allProductOptionsWithVariants: allProductOptionsWithVariants.nodes,
      request,
    });
  }

  return json({
    allProductOptionsWithVariants, // to render all variants
    allUserProductOptions: userProduct.options, //to get all durations
  });
}

export default function ProductDescription() {
  const [searchParams] = useSearchParams();

  const {product, userProduct} =
    useOutletContext<SerializeFrom<typeof rootLoader>>();
  const {descriptionHtml} = product;
  const {allProductOptionsWithVariants, allUserProductOptions} =
    useLoaderData<typeof loader>();

  const selectedVariants = usePickedVariantsToCalculateTotalPrice({
    parentId: userProduct.productId,
    allProductOptionsWithVariants: allProductOptionsWithVariants.nodes,
  });

  const selectedOptions = usePickedOptionsToCalculateDuration({
    parentId: userProduct.productId,
    userProductsOptions: userProduct.options,
  });

  const totalPrice = useMemo(() => {
    return selectedVariants.reduce(
      (total, variant) => total + parseInt(variant.price.amount || ''),
      parseInt(product.selectedVariant?.price.amount || '0'),
    );
  }, [product.selectedVariant?.price.amount, selectedVariants]);

  const totalTime = useMemo(() => {
    return selectedOptions.reduce((total, option) => {
      return total + option.duration.value;
    }, userProduct.duration);
  }, [selectedOptions, userProduct.duration]);

  return (
    <>
      <ArtistShell.Main>
        <Text
          size="lg"
          c="dimmed"
          fw={400}
          dangerouslySetInnerHTML={{__html: descriptionHtml}}
        ></Text>
        <Divider />
        {allProductOptionsWithVariants ? (
          <>
            {allProductOptionsWithVariants.nodes.map(
              (productOptionWithVariants) => {
                const userProductOptions = allUserProductOptions.find((up) =>
                  matchesGid(productOptionWithVariants.id, up.productId),
                );
                if (!userProductOptions) {
                  return <>Error: option not found</>;
                }

                return (
                  <OptionSelector
                    key={productOptionWithVariants.id}
                    parentId={parseGid(product.id).id}
                    productOptionWithVariants={productOptionWithVariants}
                    userProductOptions={userProductOptions}
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
            Total tid: {durationToTime(totalTime ?? 0)}
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
