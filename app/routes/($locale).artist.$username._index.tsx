import {defer, type LoaderFunctionArgs} from '@shopify/remix-oxygen';

import {
  Button,
  Flex,
  Group,
  HoverCard,
  SimpleGrid,
  Skeleton,
  Stack,
  Text,
  Title,
  rem,
} from '@mantine/core';
import {Await, Form, Link, useLoaderData, useLocation} from '@remix-run/react';
import {IconBuildingSkyscraper, IconCar, IconHome} from '@tabler/icons-react';
import {Suspense} from 'react';
import {ArtistProduct} from '~/components/artist/ArtistProduct';
import {TextViewer} from '~/components/richtext/TextViewer';
import {PRODUCT_ITEM_FRAGMENT} from '~/data/fragments';
import {useUser} from '~/hooks/use-user';
import {getBookingShopifyApi} from '~/lib/api/bookingShopifyApi';
import type {
  UserProductsListByScheduleParams,
  UserScheduleWithLocations,
} from '~/lib/api/model';
import {renderTime} from '~/lib/time';
import {translationsDays} from './($locale).api.users.filters';

export type SearchParams = {
  [key: string]: string | undefined;
} & UserProductsListByScheduleParams;

export async function loader({request, params, context}: LoaderFunctionArgs) {
  const {username} = params;

  if (!username) {
    throw new Error('Invalid request method');
  }

  const {searchParams} = new URL(request.url);
  const scheduleId = searchParams.get('scheduleId') as string;

  const {payload: services} =
    await getBookingShopifyApi().userProductsListBySchedule(username, {
      scheduleId,
    });

  const productIds = services.map(({productId}) => productId);

  const products = context.storefront.query(ALL_PRODUCTS_QUERY, {
    variables: {
      first: productIds.length,
      query: productIds.length > 0 ? productIds.join(' OR ') : 'id=-',
      country: context.storefront.i18n.country,
      language: context.storefront.i18n.language,
    },
  });

  const locations = getBookingShopifyApi().userSchedulesListLocations(username);

  return defer({
    products,
    services,
    locations,
  });
}

export default function ArtistIndex() {
  const data = useLoaderData<typeof loader>();
  const user = useUser();

  return (
    <Stack gap="lg">
      <Suspense fallback={<Skeleton height={8} radius="xl" />}>
        <Await resolve={data.locations}>
          {({payload}) => {
            return (
              <>
                <ArtistSchedulesMenu schedules={payload} />
                <SimpleGrid cols={{base: 1, md: 2}} spacing="lg">
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
              </>
            );
          }}
        </Await>
      </Suspense>

      {user.aboutMe ? (
        <Stack gap="xs" mt="xl">
          <Title size={rem(28)}>Om mig</Title>
          <TextViewer content={user.aboutMe} />
        </Stack>
      ) : null}
    </Stack>
  );
}

function ArtistSchedulesMenu({
  schedules,
}: {
  schedules: UserScheduleWithLocations[];
}) {
  const user = useUser();
  const location = useLocation();
  return (
    <Form method="get">
      <Flex gap="lg">
        <Button
          size="lg"
          variant={location.search === '' ? 'filled' : 'light'}
          color={location.search === '' ? 'black' : user.theme.color}
          component={Link}
          to="?"
        >
          Alle
        </Button>
        {schedules.map((schedule) => (
          <HoverCard
            key={schedule._id}
            width={200}
            shadow="md"
            withArrow
            openDelay={200}
            closeDelay={400}
          >
            <HoverCard.Target>
              <Button
                size="lg"
                variant={
                  location.search.includes(schedule._id) ? 'filled' : 'light'
                }
                color={
                  location.search.includes(schedule._id)
                    ? 'black'
                    : user.theme.color
                }
                component={Link}
                to={`?scheduleId=${schedule._id}`}
              >
                {schedule.name}
              </Button>
            </HoverCard.Target>
            <HoverCard.Dropdown>
              <Text size="md" fw="bold">
                Arbejdstimer
              </Text>

              <Group mt="xs" mb="md" gap="xs">
                {schedule.slots.map((slot) => (
                  <Text component="div" key={slot.day} size="sm">
                    {translationsDays[slot.day]}{' '}
                    {slot.intervals.map(
                      ({from, to}) =>
                        `${renderTime(from)}${' '}-${' '}${renderTime(to)}`,
                    )}
                  </Text>
                ))}
              </Group>

              <Text size="md" fw="bold">
                Lokationer
              </Text>

              <Group mt="xs" mb="md" gap="xs">
                {schedule.locations.map((location) => (
                  <Flex key={location._id} gap="4px" align="center">
                    <Text size="sm">{location.name} </Text>
                    {location.locationType === 'destination' ? (
                      <IconCar />
                    ) : location.originType === 'home' ? (
                      <IconHome />
                    ) : (
                      <IconBuildingSkyscraper />
                    )}
                  </Flex>
                ))}
              </Group>
            </HoverCard.Dropdown>
          </HoverCard>
        ))}
      </Flex>
    </Form>
  );
}

export const ALL_PRODUCTS_QUERY = `#graphql
  ${PRODUCT_ITEM_FRAGMENT}
  query ArtistServicesProducts(
    $country: CountryCode
    $language: LanguageCode
    $first: Int
    $query: String
  ) @inContext(country: $country, language: $language) {
    products(first: $first, sortKey: TITLE, query: $query) {
      nodes {
        ...ProductItem
      }
    }
  }
` as const;
