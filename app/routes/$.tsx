import {
  Alert,
  Avatar,
  Badge,
  Button,
  Card,
  Container,
  Divider,
  Flex,
  Grid,
  Group,
  Loader,
  rem,
  Skeleton,
  Spoiler,
  Stack,
  Text,
  Title,
  UnstyledButton,
} from '@mantine/core';
import '@mantine/tiptap/styles.css';
import {Await, Link, useLoaderData} from '@remix-run/react';
import {
  defer,
  type LinksFunction,
  type LoaderFunctionArgs,
  type MetaFunction,
} from '@shopify/remix-oxygen';
import React, {Suspense, useEffect, useMemo, useState} from 'react';

import {parseGid} from '@shopify/hydrogen';
import {da} from 'date-fns/locale';

import {
  IconBrandFacebook,
  IconBrandInstagram,
  IconBrandX,
  IconBrandYoutube,
  IconInfoCircle,
} from '@tabler/icons-react';
import {format} from 'date-fns';
import type {
  ScheduleFragment,
  TreatmentProductFragment,
} from 'storefrontapi.generated';
import {LocationIcon} from '~/components/LocationIcon';

import {
  type CustomerLocationAllOfGeoLocation,
  type CustomerScheduleSlot,
} from '~/lib/api/model';
import {convertLocations} from '~/lib/convertLocations';
import {useDuration} from '~/lib/duration';

import {AE, DK, US} from 'country-flag-icons/react/3x2';
import leafletStyles from 'leaflet/dist/leaflet.css?url';
import {useTranslation} from 'react-i18next';
import {ClientOnly} from 'remix-utils/client-only';
import {
  LeafletMap,
  type LeafletMapMarker,
} from '~/components/LeafletMap.client';
import {USER_METAOBJECT_QUERY} from '~/graphql/fragments/UserMetaobject';
import {GET_USER_PRODUCTS} from '~/graphql/queries/GetUserProducts';
import {UserProvider, useUser} from '~/hooks/use-user';

import localLeafletStyles from '~/styles/leaflet.css?url';

export const links: LinksFunction = () => [
  {
    rel: 'stylesheet',
    href: leafletStyles,
  },
  {
    rel: 'stylesheet',
    href: localLeafletStyles,
  },
];

export const handle: Handle = {
  i18n: ['global', 'profile', 'professions', 'skills'],
};

export function shouldRevalidate() {
  return false;
}

export const meta: MetaFunction<typeof loader> = ({data}) => {
  return [
    {
      title: `BySisters | ${data?.user?.fullname?.value ?? ''}`,
    },
  ];
};

export async function loader({request, context}: LoaderFunctionArgs) {
  const {storefront} = context;
  const url = new URL(request.url);
  const username = url.pathname.substring(1);

  if (!username) {
    throw new Error('Invalid request method');
  }

  const {metaobject: user} = await storefront.query(USER_METAOBJECT_QUERY, {
    variables: {
      username,
    },
    cache: context.storefront.CacheShort(),
  });

  if (!user) {
    throw new Response(`${new URL(request.url).pathname} not found`, {
      status: 404,
    });
  }

  const collection = context.storefront.query(GET_USER_PRODUCTS, {
    variables: {
      handle: username,
      filters: [
        {
          productMetafield: {
            namespace: 'system',
            key: 'type',
            value: 'product',
          },
        },
        {
          productMetafield: {
            namespace: 'booking',
            key: 'hide_from_profile',
            value: 'false',
          },
        },
      ],
    },
    cache: context.storefront.CacheShort(),
  });

  return defer({
    user,
    collection,
  });
}

export default function UserIndex() {
  const {user} = useLoaderData<typeof loader>();

  return (
    <UserProvider user={user}>
      <Container size="xl" mb="xl" mt={rem(100)}>
        <AboutMe />
        <UserTreatments />
      </Container>
    </UserProvider>
  );
}

function AboutMe() {
  const {t} = useTranslation(['global', 'profile', 'professions', 'skills']);
  const user = useUser();

  return (
    <Flex direction="column" gap="xl" mb={rem(100)}>
      <Flex direction="column">
        <Flex gap={{base: 'md', sm: 'xl'}} align="center">
          <Avatar src={user?.image?.url} size={rem(150)} visibleFrom="sm" />
          <Avatar src={user?.image?.url} size={rem(100)} hiddenFrom="sm" />
          <Stack gap="4px">
            <Group>
              <Title order={1} fz="h2">
                {user?.fullname}{' '}
              </Title>
              <Text component="span" c="gray.5" fw="600">
                @{user.username}
              </Text>
            </Group>
            <Text fz="lg">
              {user?.shortDescription} <br />
            </Text>
            {user.speaks?.length > 0 ? (
              <Stack gap="xs">
                <Flex wrap="wrap" gap="xs">
                  {user.speaks.includes('danish') && (
                    <Group gap="xs">
                      <DK width={18} height={18} />
                      {t('danish')}
                    </Group>
                  )}
                  {user.speaks.includes('english') && (
                    <Group gap="xs">
                      <US width={18} height={18} />
                      {t('english')}
                    </Group>
                  )}
                  {user.speaks.includes('arabic') && (
                    <Group gap="xs">
                      <AE width={18} height={18} />
                      {t('arabic')}
                    </Group>
                  )}
                </Flex>
              </Stack>
            ) : null}
          </Stack>
        </Flex>
      </Flex>

      <Grid gutter="xl">
        <Grid.Col span={{base: 12, sm: 8}}>
          <Stack>
            {user.aboutMe ? (
              <Stack gap="xs">
                <Title order={2} fw="600" fz="h5">
                  {t('profile:about_me')}
                </Title>
                <Spoiler
                  maxHeight={54}
                  showLabel={t('show_more', {ns: 'global'})}
                  hideLabel={t('hide', {ns: 'global'})}
                >
                  <div
                    dangerouslySetInnerHTML={{
                      __html: user.aboutMe
                        .replace(/^<p>/, '')
                        .replace(/<\/p>$/, ''),
                    }}
                  ></div>
                </Spoiler>
              </Stack>
            ) : null}

            {user.professions.length > 0 ? (
              <Stack gap="xs">
                <Title order={2} fw="600" fz="h5">
                  {t('profile:professions')}
                </Title>
                <Flex wrap="wrap" gap="xs">
                  {user.professions.map((p) => (
                    <Badge
                      variant="outline"
                      c="black"
                      color="gray.4"
                      key={p}
                      fw="400"
                    >
                      {t(p as any, {ns: 'professions'})}
                    </Badge>
                  ))}
                </Flex>
              </Stack>
            ) : null}

            {user.specialties.length > 0 ? (
              <Stack gap="xs">
                <Title order={2} fw="600" fz="h5">
                  {t('profile:skills')}
                </Title>
                <Flex wrap="wrap" gap="xs">
                  {user.specialties.map((p) => (
                    <Badge
                      variant="outline"
                      c="black"
                      color="gray.4"
                      key={p}
                      fw="400"
                    >
                      {t(p as any, {ns: 'skills'})}
                    </Badge>
                  ))}
                </Flex>
              </Stack>
            ) : null}
          </Stack>
        </Grid.Col>
        <Grid.Col span={{base: 12, sm: 4}}>
          {user.social && Object.keys(user.social).length > 0 ? (
            <Card withBorder radius="md">
              <Stack gap="xl">
                <Stack gap="xs">
                  <Title order={2} fw="600" fz="h5">
                    {t('profile:social_media')}
                  </Title>
                  <Stack gap="xs">
                    {user.social.instagram ? (
                      <Group>
                        <IconBrandInstagram />
                        <UnstyledButton
                          component={Link}
                          to={user.social.instagram}
                          target="_blank"
                        >
                          {t('profile:instagram')}
                        </UnstyledButton>
                      </Group>
                    ) : null}
                    {user.social.youtube ? (
                      <Group>
                        <IconBrandYoutube />
                        <UnstyledButton
                          component={Link}
                          to={user.social.youtube}
                          target="_blank"
                        >
                          {t('profile:youtube')}
                        </UnstyledButton>
                      </Group>
                    ) : null}
                    {user.social.x ? (
                      <Group>
                        <IconBrandX />
                        <UnstyledButton
                          component={Link}
                          to={user.social.x}
                          target="_blank"
                        >
                          {t('profile:x')}
                        </UnstyledButton>
                      </Group>
                    ) : null}
                    {user.social.facebook ? (
                      <Group>
                        <IconBrandFacebook />
                        <UnstyledButton
                          component={Link}
                          to={user.social.facebook}
                          target="_blank"
                        >
                          {t('profile:facebook')}
                        </UnstyledButton>
                      </Group>
                    ) : null}
                  </Stack>
                </Stack>
              </Stack>
            </Card>
          ) : null}
        </Grid.Col>
      </Grid>

      {!user?.active ? (
        <Alert
          variant="light"
          title={t('profile:not_active_title')}
          icon={<IconInfoCircle />}
        >
          {t('profile:not_active_description')}
        </Alert>
      ) : null}
    </Flex>
  );
}

function UserTreatments() {
  const data = useLoaderData<typeof loader>();
  const {t} = useTranslation(['profile']);
  const user = useUser();

  return (
    <>
      <Title order={2} fw="600" mb="md">
        {t('treatments_title')}
      </Title>

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
                    {Object.keys(collections)
                      .sort()
                      .map((key) => (
                        <Stack key={key} gap="sm">
                          <Title order={4} fw="600">
                            {key}
                          </Title>
                          <Stack gap="md">
                            {collections[key].map((product) => (
                              <ArtistProduct
                                key={product.id}
                                product={product}
                              />
                            ))}
                          </Stack>
                        </Stack>
                      ))}
                  </Stack>
                </Grid.Col>
                <Grid.Col span={{base: 12, md: 4}}>
                  <Stack gap="md">
                    {user.schedules
                      ?.sort((a, b) => {
                        const aContainsMonday =
                          a.slots?.value?.includes('monday');
                        const bContainsMonday =
                          b.slots?.value?.includes('monday');

                        if (aContainsMonday && !bContainsMonday) {
                          return -1;
                        } else if (!aContainsMonday && bContainsMonday) {
                          return 1;
                        } else {
                          return 0;
                        }
                      })
                      .map((schedule) => (
                        <Schedule key={schedule.handle} schedule={schedule} />
                      ))}
                  </Stack>
                </Grid.Col>
              </Grid>
            );
          }}
        </Await>
      </Suspense>
    </>
  );
}

async function wordToColor(word: string) {
  const encoder = new TextEncoder();
  const data = encoder.encode(word);

  const hashBuffer = await crypto.subtle.digest('SHA-256', data);

  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');

  const color = `#${hashHex.substring(0, 6)}`;

  return color;
}

function Schedule({schedule}: {schedule: ScheduleFragment}) {
  const {t} = useTranslation(['profile', 'global']);
  const user = useUser();
  const [scheduleColor, setScheduleColor] = useState<string>('#fff');

  const markers = useMemo(
    () =>
      schedule.locations?.references?.nodes.reduce((geos, l) => {
        if (l.geoLocation?.value) {
          const value = JSON.parse(
            l.geoLocation.value,
          ) as CustomerLocationAllOfGeoLocation;
          geos.push({
            id: l.id,
            lat: value.coordinates[1],
            lng: value.coordinates[0],
            radius:
              l.locationType?.value === 'destination'
                ? parseInt(l.maxDriveDistance?.value || '0') * 1000
                : null,
            image: user.image.url,
          });
        }
        return geos;
      }, [] as LeafletMapMarker[]) || [],
    [schedule.locations?.references?.nodes, user.image.url],
  );

  useEffect(() => {
    const fetchColor = async () => {
      const color = await wordToColor(schedule.handle || '');
      setScheduleColor(color);
    };

    fetchColor();
  }, [schedule]);

  const slots = JSON.parse(
    schedule.slots?.value || '',
  ) as CustomerScheduleSlot[];

  return (
    <Card withBorder radius="md">
      <Card.Section bg={scheduleColor} px="md" py="sm">
        <Title order={3} c="white">
          {schedule.name?.value}
        </Title>
      </Card.Section>
      <Divider mb="md" />
      <Title order={4} mb="xs">
        {t('openingtime')}
      </Title>
      <Stack gap={rem(3)} mb="md">
        {slots?.map((slot) => {
          return (
            <Group key={slot.day}>
              <Text>{t(slot.day as any, {ns: 'global'})}</Text>
              {slot.intervals.map((interval) => {
                return (
                  <Group key={interval.from + interval.to}>
                    <Text>
                      {format(timeToDate(interval.from, new Date()), 'HH:mm', {
                        locale: da,
                      })}{' '}
                      -{' '}
                      {format(timeToDate(interval.to, new Date()), 'HH:mm', {
                        locale: da,
                      })}
                    </Text>
                  </Group>
                );
              })}
            </Group>
          );
        })}
      </Stack>

      {schedule.locations?.references?.nodes.map((location) => (
        <React.Fragment key={location.handle}>
          <Card.Section>
            <Divider mb="md" />
          </Card.Section>
          <Group mb="md">
            <LocationIcon
              location={{locationType: location.locationType?.value as any}}
              color={scheduleColor || '#000000'}
            />
            {location.locationType?.value === 'destination' ||
            location.locationType?.value === 'virtual' ? (
              <>
                <Text>
                  {
                    location.fullAddress?.value?.split(',')[
                      location.fullAddress?.value?.split(',').length - 1
                    ]
                  }
                </Text>
                <Text>Hvor skønhedseksperten kører ud til!</Text>
              </>
            ) : (
              <>
                <Text>{location.fullAddress?.value}</Text>
                <Text>Hvor behandling finder sted!</Text>
              </>
            )}
          </Group>
          <Card.Section>
            <ClientOnly fallback={<Loader />}>
              {() => (
                <LeafletMap
                  markers={markers.filter((m) => m.id === location.id)}
                />
              )}
            </ClientOnly>
          </Card.Section>
        </React.Fragment>
      ))}
    </Card>
  );
}

export function ArtistProduct({product}: {product: TreatmentProductFragment}) {
  const durationToTime = useDuration();
  const [scheduleColor, setScheduleColor] = useState<string>('#fff');
  const {t} = useTranslation(['profile', 'global']);

  useEffect(() => {
    const fetchColor = async () => {
      const color = await wordToColor(
        product.scheduleId?.reference?.handle || '',
      );
      setScheduleColor(color);
    };

    fetchColor();
  }, [product.scheduleId]);

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
      return `${t('discount', {ns: 'global'})} ${discountPercentage.toFixed(
        0,
      )}%`;
    }
    return null;
  }, [t, variant.compareAtPrice?.amount, variant.price.amount]);

  return (
    <Card
      key={product.handle}
      withBorder
      component={Link}
      radius="md"
      data-testid={`service-item-${productId}`}
      to={`/book/${product.handle}`}
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
                  .map((location) => (
                    <LocationIcon
                      key={location.locationType}
                      location={location}
                      color={scheduleColor}
                    />
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
                {product.options?.value ? t('from', {ns: 'global'}) : ''}{' '}
                {variant.price.amount} kr
              </Text>
              {discountString ? <Text size="sm">{discountString}</Text> : null}
            </Group>
          </Flex>
        </Grid.Col>
        <Grid.Col span={4}>
          <Flex justify="flex-end" align="center" h="100%">
            <Button variant="outline" c="black" color="gray.4" radius="lg">
              {t('booktime')}
            </Button>
          </Flex>
        </Grid.Col>
      </Grid>
    </Card>
  );
}

// Helper function to convert time string to Date object
function timeToDate(time: string, date: Date): Date {
  const [hour, minute] = time.split(':').map(Number);
  const newDate = new Date(date);
  newDate.setUTCHours(hour, minute, 0, 0);
  return newDate;
}
