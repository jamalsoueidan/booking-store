import {defer, type LoaderFunctionArgs} from '@shopify/remix-oxygen';

import {Button, Flex, SimpleGrid, Skeleton, Stack} from '@mantine/core';
import {Await, Form, Link, useLoaderData, useLocation} from '@remix-run/react';
import {Suspense} from 'react';
import {ArtistProduct} from '~/components/artist/ArtistProduct';
import {PRODUCT_SERVICE_ITEM_FRAGMENT} from '~/data/fragments';
import {getBookingShopifyApi} from '~/lib/api/bookingShopifyApi';
import {
  type UserProductsListByScheduleParams,
  type UserScheduleWithLocations,
} from '~/lib/api/model';

export type SearchParams = {
  [key: string]: string | undefined;
} & UserProductsListByScheduleParams;

export async function loader({request, params, context}: LoaderFunctionArgs) {
  const {username} = params;

  if (!username) {
    throw new Error('Invalid request method');
  }

  const url = new URL(request.url);
  const searchParams: SearchParams = {
    scheduleId: undefined,
  };

  for (const [key, value] of url.searchParams.entries()) {
    searchParams[key] = value;
  }

  //get products for specific schedule id
  const {payload: services} =
    await getBookingShopifyApi().userProductsListBySchedule(
      username,
      searchParams,
    );

  const productIds = services.map(({productId}) => productId);

  const products = context.storefront.query(ALL_PRODUCTS_QUERY, {
    variables: {
      first: productIds.length,
      query: productIds.length > 0 ? productIds.join(' OR ') : 'id=-',
      country: context.storefront.i18n.country,
      language: context.storefront.i18n.language,
    },
  });

  const schedules = getBookingShopifyApi().userSchedulesListLocations(username);

  return defer({
    products,
    services,
    schedules,
  });
}

export default function ArtistIndex() {
  const data = useLoaderData<typeof loader>();

  return (
    <Stack gap="lg">
      <Suspense
        fallback={
          <div>
            <Skeleton height={8} radius="xl" />
          </div>
        }
      >
        <Await resolve={data.schedules}>
          {({payload}) => <ArtistSchedulesMenu data={payload} />}
        </Await>
      </Suspense>
      <SimpleGrid cols={{base: 1, lg: 4, md: 3, sm: 2}} spacing="xl">
        <Suspense
          fallback={
            <div>
              <Skeleton height={50} circle mb="xl" />
              <Skeleton height={8} radius="xl" />
            </div>
          }
        >
          <Await resolve={data.products}>
            {({products}) =>
              products.nodes.map((product) => (
                <ArtistProduct
                  key={product.id}
                  product={product}
                  services={data.services}
                />
              ))
            }
          </Await>
        </Suspense>
      </SimpleGrid>
    </Stack>
  );
}

function ArtistSchedulesMenu({data}: {data: UserScheduleWithLocations[]}) {
  const location = useLocation();

  if (data.length <= 1) return null;

  return (
    <Form method="get">
      <Flex gap="lg">
        <Button
          size="lg"
          variant={location.search === '' ? 'filled' : 'light'}
          color={location.search === '' ? 'black' : 'gray'}
          component={Link}
          to="?"
        >
          Alle
        </Button>
        {data.map((schedule) => (
          <Button
            size="lg"
            key={schedule._id}
            variant={
              location.search.includes(schedule._id) ? 'filled' : 'light'
            }
            color={location.search.includes(schedule._id) ? 'black' : 'gray'}
            component={Link}
            to={`?scheduleId=${schedule._id}`}
          >
            {schedule.name}
          </Button>
        ))}
      </Flex>
    </Form>
  );
}

export const ALL_PRODUCTS_QUERY = `#graphql
  ${PRODUCT_SERVICE_ITEM_FRAGMENT}
  query ArtistServicesProducts(
    $country: CountryCode
    $language: LanguageCode
    $first: Int
    $query: String
  ) @inContext(country: $country, language: $language) {
    products(first: $first, sortKey: TITLE, query: $query) {
      nodes {
        ...ProductServiceItem
      }
    }
  }
` as const;
