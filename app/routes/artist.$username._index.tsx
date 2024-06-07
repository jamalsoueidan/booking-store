import {defer, type LoaderFunctionArgs} from '@shopify/remix-oxygen';

import {
  Button,
  Card,
  Divider,
  Flex,
  Grid,
  Group,
  rem,
  Skeleton,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import '@mantine/tiptap/styles.css';
import {Await, Link, Outlet, useLoaderData} from '@remix-run/react';
import {Suspense, useMemo} from 'react';

import {parseGid} from '@shopify/hydrogen';
import {IconGps} from '@tabler/icons-react';
import type {
  LocationFragment,
  ScheduleFragment,
  TreatmentProductFragment,
} from 'storefrontapi.generated';
import {LocationIcon, LocationText} from '~/components/LocationIcon';
import {GET_USER_PRODUCTS} from '~/graphql/queries/GetUserProducts';
import {useUser} from '~/hooks/use-user';
import {type CustomerScheduleSlot} from '~/lib/api/model';
import {convertLocations} from '~/lib/convertLocations';
import {durationToTime} from '~/lib/duration';
import {translationsDays} from './api.users.filters';

export async function loader({request, params, context}: LoaderFunctionArgs) {
  const {username} = params;

  if (!username) {
    throw new Response('username handler not defined', {
      status: 404,
    });
  }

  const {searchParams} = new URL(request.url);
  const type = searchParams.get('type');

  const collection = context.storefront.query(GET_USER_PRODUCTS, {
    variables: {
      handle: username,
      filters: [
        {tag: 'treatments'},
        {
          productMetafield: {
            namespace: 'booking',
            key: 'hide_from_profile',
            value: 'false',
          },
        },
        ...(type ? [{productType: type}] : []),
      ],
      country: context.storefront.i18n.country,
      language: context.storefront.i18n.language,
    },
    cache: context.storefront.CacheShort(),
  });

  return defer({
    collection,
  });
}

export default function ArtistIndex() {
  const data = useLoaderData<typeof loader>();
  const user = useUser();

  return (
    <Suspense fallback={<Skeleton height={8} radius="xl" />}>
      <Await resolve={data.collection}>
        {({collection}) => {
          const collections =
            collection?.products.nodes.reduce((collections, product) => {
              if (!collections[product.productType]) {
                collections[product.productType] = [];
              }
              collections[product.productType].push(product);
              return collections;
            }, {} as Record<string, TreatmentProductFragment[]>) || {};
          return (
            <Grid gutter="xl">
              <Grid.Col span={{base: 12, md: 8}}>
                <Stack gap="xl">
                  {Object.keys(collections).map((key) => (
                    <Stack key={key} gap="sm">
                      <Title order={3} fw="bold">
                        {key}
                      </Title>
                      <Stack gap="md">
                        {collections[key].map((product) => (
                          <ArtistProduct key={product.id} product={product} />
                        ))}
                      </Stack>
                    </Stack>
                  ))}
                </Stack>
              </Grid.Col>
              <Grid.Col span={{base: 12, md: 4}}>
                <Stack gap="md">
                  {user.locations?.map((location) => (
                    <Location
                      key={location.id}
                      location={location}
                      schedules={user.schedules}
                    />
                  ))}
                </Stack>
              </Grid.Col>
            </Grid>
          );
        }}
      </Await>
      <Outlet />
    </Suspense>
  );
}

function Location({
  location,
  schedules,
}: {
  location: LocationFragment;
  schedules?: ScheduleFragment[];
}) {
  const slots = schedules
    ?.reduce((slots, schedule) => {
      const found = schedule.locations?.references?.nodes.some(
        (l) => l.id === location.id,
      );

      if (found) {
        slots.push(
          JSON.parse(schedule.slots?.value || '') as CustomerScheduleSlot[],
        );
      }

      return slots;
    }, [] as Array<Array<CustomerScheduleSlot>>)
    .reverse()
    .flat();

  return (
    <Card withBorder radius="md">
      <Card.Section bg="black" px="md" py="sm">
        <Title order={3} c="white">
          <Group>
            <LocationIcon
              location={{
                locationType: location.locationType?.value as any,
              }}
            />

            <LocationText
              location={{
                locationType: location.locationType?.value as any,
              }}
            />
          </Group>
        </Title>
      </Card.Section>
      <Divider mb="md" />
      <Title order={4} mb="xs">
        Åbningstider{' '}
      </Title>
      <Stack gap={rem(3)}>
        {slots?.map((slot) => {
          return (
            <Group key={slot.day}>
              <Text>{translationsDays[slot.day]}</Text>
              {slot.intervals.map((interval) => {
                return (
                  <Group key={interval.from + interval.to}>
                    <Text>
                      {interval.from} - {interval.to}
                    </Text>
                  </Group>
                );
              })}
            </Group>
          );
        })}
      </Stack>
      <Card.Section>
        <Divider my="md" />
      </Card.Section>
      {location.locationType?.value !== 'destination' ? (
        <Group>
          <IconGps />
          {location.fullAddress?.value}
        </Group>
      ) : (
        <Group>
          <IconGps />
          {
            location.fullAddress?.value?.split(',')[
              location.fullAddress?.value?.split(',').length - 1
            ]
          }
        </Group>
      )}
    </Card>
  );
}

export function ArtistProduct({product}: {product: TreatmentProductFragment}) {
  const productId = parseGid(product?.id).id;
  const locations = convertLocations(product.locations?.references?.nodes);
  const variant = product.variants.nodes[0];

  const discountString = useMemo(() => {
    if (
      variant.compareAtPrice?.amount &&
      variant.compareAtPrice?.amount !== '0.0'
    ) {
      const discountAmount =
        parseInt(variant.compareAtPrice?.amount) -
        parseInt(variant.price.amount);
      const discountPercentage = Math.abs(
        (discountAmount / parseInt(variant.compareAtPrice?.amount)) * 100,
      );
      return `Spar ${discountPercentage.toFixed(0)}%`;
    }
    return null;
  }, [variant.compareAtPrice?.amount, variant.price.amount]);

  return (
    <Card
      key={product.handle}
      withBorder
      component={Link}
      radius="md"
      data-testid={`service-item-${productId}`}
      to={`treatment/${product.handle}`}
    >
      <Grid>
        <Grid.Col span={8}>
          <Flex direction="column" gap="xs">
            <div>
              <Group gap="xs">
                <Title
                  order={2}
                  size="md"
                  fw={500}
                  lts=".5px"
                  data-testid={`service-title-${productId}`}
                >
                  {product.title}
                </Title>
                {locations
                  .map((l) => ({
                    locationType: l.locationType,
                  }))
                  .filter(
                    (value, index, self) =>
                      index ===
                      self.findIndex(
                        (t) => t.locationType === value.locationType,
                      ),
                  )
                  .map((location, index) => (
                    // eslint-disable-next-line react/no-array-index-key
                    <LocationIcon key={index} location={location} />
                  ))}
              </Group>

              <Text
                c="dimmed"
                size="sm"
                data-testid={`service-duration-text-${productId}`}
              >
                {durationToTime(product.duration?.value || 0)}
              </Text>
            </div>

            <Group>
              <Text size="sm">
                {product.options?.value ? 'fra' : ''} {variant.price.amount} kr
              </Text>
              {discountString ? (
                <Text c="green.9" size="sm">
                  {discountString}
                </Text>
              ) : null}
            </Group>
          </Flex>
        </Grid.Col>
        <Grid.Col span={4}>
          <Flex justify="flex-end" align="center" h="100%">
            <Button variant="outline" c="black" color="gray.4" radius="lg">
              Bestil tid
            </Button>
          </Flex>
        </Grid.Col>
      </Grid>
    </Card>
  );
}
