import {
  Avatar,
  Badge,
  Button,
  Card,
  Flex,
  Group,
  rem,
  SimpleGrid,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import {Link, useLoaderData} from '@remix-run/react';
import {getPaginationVariables, Pagination} from '@shopify/hydrogen';
import {type ArticleSortKeys} from '@shopify/hydrogen/storefront-api-types';
import {
  json,
  type LoaderFunctionArgs,
  type MetaFunction,
} from '@shopify/remix-oxygen';
import {DK, US} from 'country-flag-icons/react/3x2';
import {useTranslation} from 'react-i18next';
import {type ArticleUserFragment} from 'storefrontapi.generated';
import {LocationIcon} from '~/components/LocationIcon';
import {ARTICLE_USER_FRAGMENT} from '~/graphql/fragments/ArticleUser';
import {CustomerLocationBaseLocationType} from '~/lib/api/model';
import {splitTags} from '~/lib/tags';

export const meta: MetaFunction = () => {
  return [{title: `BySisters | Find Skønhedseksperter`}];
};

export const loader = async ({context, request}: LoaderFunctionArgs) => {
  const {storefront} = context;

  const url = new URL(request.url);
  const searchParams = new URLSearchParams(url.search);

  const query = [];
  let sortKey: ArticleSortKeys = 'RELEVANCE';
  let reverse = false;

  const sort = searchParams.get('sort');
  if (sort === 'published_at' || sort === 'reverse') {
    sortKey = 'PUBLISHED_AT';
  }

  if (sort === 'published_at') {
    reverse = true;
  }

  if (sort === 'title') {
    sortKey = 'TITLE';
  }

  const city = searchParams.get('city');
  if (city) {
    query.push(`tag:city-${city}`);
  }

  const profession = searchParams.get('profession');
  if (profession) {
    query.push(`tag:profession-${profession}`);
  }

  const gender = searchParams.get('gender');
  if (gender) {
    query.push(`tag:gender-${gender}`);
  }

  const days = searchParams.get('days');
  if (days) {
    const d = days.split(',');
    query.push(`tag:day-${d.join(' OR tag:day-')}`);
  }

  const lang = searchParams.get('lang');
  if (lang) {
    const l = lang.split(',').filter((l) => l.length > 0);
    query.push(`tag:speak-${l.join(' OR tag:speak-')}`);
  }

  const location = searchParams.get('location');
  if (location) {
    query.push(`tag:location_type-${location}`);
  }

  const product = searchParams.get('product');
  if (product) {
    query.push(`tag:parentid-${product}`);
  } else {
    query.push('tag:parentid');
  }

  const paginationVariables = getPaginationVariables(request, {
    pageBy: 10,
  });

  const {data} = await storefront.query(USERS_QUERY, {
    variables: {
      sortKey,
      reverse,
      ...(query.length > 0 ? {query: query.join(' AND ')} : {}),
      ...paginationVariables,
    },
    cache: context.storefront.CacheShort(),
  });

  return json({users: data});
};

export default function Component() {
  const {t} = useTranslation(['global']);
  const {users} = useLoaderData<typeof loader>();

  if (!users) return <>No users</>;

  return (
    <Pagination connection={users?.users}>
      {({nodes, isLoading, PreviousLink, NextLink}) => (
        <Stack gap="xl" mb={rem(50)}>
          <Flex justify="center">
            <Button
              variant="default"
              component={PreviousLink}
              loading={isLoading}
              size="xl"
            >
              ↑ {t('pagination_previous_button')}
            </Button>
          </Flex>
          <SimpleGrid cols={{base: 1, sm: 2, md: 3}} spacing="lg">
            {nodes.map((article) => {
              return <UserCard article={article as any} key={article.id} />;
            })}
          </SimpleGrid>
          <Flex justify="center">
            <Button
              variant="default"
              component={NextLink}
              loading={isLoading}
              size="xl"
            >
              {t('pagination_next_button')} ↓
            </Button>
          </Flex>
        </Stack>
      )}
    </Pagination>
  );
}

export const UserCard = ({article}: {article: ArticleUserFragment}) => {
  const {t} = useTranslation(['professions']);
  const user = article.user?.reference;
  const professions = user?.professions?.value
    ? (JSON.parse(user.professions.value) as Record<string, []>)
    : {professions: []};

  const tags = splitTags(article.tags);
  const products = article.collection?.reference?.products.nodes;
  const filters = article.collection?.reference?.products.filters;
  const availability = filters
    ?.find((p) => p.id === 'filter.v.availability')
    ?.values.find((p) => (p.input as string).includes('true'));

  const total = (availability?.count || 0) - (products?.length || 0);

  return (
    <Card
      component={Link}
      to={`/${user?.username?.value}`}
      withBorder
      radius="md"
      pos="relative"
      bg="transparent"
    >
      <Group>
        <Avatar
          style={{border: '3px solid #FFF'}}
          src={
            user?.image?.reference?.image?.url ||
            'https://placehold.co/400x600?text=Ekspert'
          }
          size={rem(100)}
        />

        <Flex direction="column" justify="center">
          <Text fz="lg" fw={600} c="black">
            {user?.fullname?.value}{' '}
          </Text>

          <Group gap="4">
            {tags['location_type']?.includes(
              CustomerLocationBaseLocationType.destination,
            ) && (
              <LocationIcon
                location={{
                  locationType: CustomerLocationBaseLocationType.destination,
                }}
                width={18}
                height={18}
                color="gray"
              />
            )}
            {tags['location_type']?.includes(
              CustomerLocationBaseLocationType.commercial,
            ) && (
              <LocationIcon
                location={{
                  locationType: CustomerLocationBaseLocationType.commercial,
                }}
                width={18}
                height={18}
                color="gray"
              />
            )}
            {tags['location_type']?.includes(
              CustomerLocationBaseLocationType.home,
            ) && (
              <LocationIcon
                location={{
                  locationType: CustomerLocationBaseLocationType.home,
                }}
                width={18}
                height={18}
                color="gray"
              />
            )}
            {tags['location_type']?.includes(
              CustomerLocationBaseLocationType.virtual,
            ) && (
              <LocationIcon
                location={{
                  locationType: CustomerLocationBaseLocationType.virtual,
                }}
                width={18}
                height={18}
                color="gray"
              />
            )}
            <Text fz="md" c="dimmed" lineClamp={1}>
              {tags['city'][0][0].toUpperCase()}
              {tags['city'][0].substring(1)}
            </Text>
          </Group>

          {tags['speak'] ? (
            <Group mt="2px">
              <Flex gap="xs">
                {tags['speak'].includes('danish') && (
                  <DK width={18} height={18} />
                )}
                {tags['speak'].includes('english') && (
                  <US width={18} height={18} />
                )}
              </Flex>
            </Group>
          ) : null}
        </Flex>
      </Group>
      <Flex gap="xs" my="md">
        {professions['professions'].map((p) => (
          <Badge variant="outline" c="black" color="gray.4" key={p} fw="400">
            {t(p as any, {ns: 'professions'})}
          </Badge>
        ))}
      </Flex>
      <SimpleGrid cols={total > 0 ? 3 : 2} spacing="xs">
        {products?.map((p, index) => (
          <Avatar
            key={p.id}
            src={p.featuredImage?.url}
            radius="0"
            size="100%"
            style={
              index === 0
                ? {
                    borderTopLeftRadius: '10px',
                    borderBottomLeftRadius: '10px',
                  }
                : {}
            }
          />
        ))}
        {total > 0 ? (
          <Avatar
            radius="0"
            size="100%"
            style={{
              borderTopRightRadius: '10px',
              borderBottomRightRadius: '10px',
            }}
          >
            <Title>
              +{(availability?.count || 0) - (products?.length || 0)}
            </Title>
          </Avatar>
        ) : null}
      </SimpleGrid>
    </Card>
  );
};

export const USERS_QUERY = `#graphql
  ${ARTICLE_USER_FRAGMENT}
  query ArtistsIndex(
    $country: CountryCode
    $language: LanguageCode
    $first: Int
    $last: Int
    $startCursor: String
    $endCursor: String
    $query: String
    $sortKey: ArticleSortKeys = PUBLISHED_AT
    $reverse: Boolean = true
  ) @inContext(country: $country, language: $language) {
    data: blog(id: "gid://shopify/Blog/105364226375") {
      users: articles(first: $first, last: $last, before: $startCursor, after: $endCursor, query: $query, sortKey: $sortKey, reverse: $reverse) {
        nodes {
          ...ArticleUser
        }
        pageInfo {
          hasPreviousPage
          hasNextPage
          endCursor
          startCursor
        }
      }
    }
  }
` as const;
