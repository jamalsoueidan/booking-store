import {
  Avatar,
  Badge,
  Button,
  Card,
  Flex,
  Group,
  Image,
  rem,
  SimpleGrid,
  Stack,
  Text,
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
import {type ArticleUserFragment} from 'storefrontapi.generated';
import {LocationIcon} from '~/components/LocationIcon';
import {METAFIELD_QUERY} from '~/data/fragments';
import {ARTICLE_USER_FRAGMENT} from '~/graphql/fragments/ArticleUser';
import {splitTags} from '~/lib/tags';
import {ProfessionTranslations} from './api.users.professions';

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
    query.push(`tag:location-${location}`);
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

  const {metaobject: components} = await context.storefront.query(
    METAFIELD_QUERY,
    {
      variables: {
        handle: 'artists',
        type: 'components',
      },
    },
  );

  return json({users: data, components});
};

export default function Component() {
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
              ↑ Hent tidligere
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
              Hent flere ↓
            </Button>
          </Flex>
        </Stack>
      )}
    </Pagination>
  );
}

export const UserCard = ({article}: {article: ArticleUserFragment}) => {
  const user = article.user?.reference;
  const professions = user?.professions?.value
    ? (JSON.parse(user.professions.value) as Record<string, []>)
    : {professions: []};

  const tags = splitTags(article.tags);
  const products = article.collection?.reference?.products.nodes;

  return (
    <Card
      component={Link}
      to={`/artist/${user?.username?.value}`}
      withBorder
      radius="lg"
      p="xs"
      pos="relative"
    >
      <SimpleGrid cols={3} spacing="6px">
        {products?.map((p, index) => (
          <Image
            key={p.id}
            src={p.featuredImage?.url}
            style={
              index === 0
                ? {borderTopLeftRadius: '10px', borderBottomLeftRadius: '10px'}
                : index === 2
                ? {
                    borderTopRightRadius: '10px',
                    borderBottomRightRadius: '10px',
                  }
                : {}
            }
          />
        ))}
      </SimpleGrid>
      <Flex mt="-40px" justify="center">
        <Avatar
          style={{border: '3px solid #FFF'}}
          src={
            user?.image?.reference?.image?.url ||
            'https://placehold.co/400x600?text=Ekspert'
          }
          size={rem(72)}
        />
      </Flex>

      <Flex direction="column" px="xs" pb="0" pt="6px" gap="sm">
        <div>
          <Text fz="lg" fw={600} c="black" ta="center">
            {user?.fullname?.value}{' '}
          </Text>

          <Group gap="4" justify="center">
            {tags['location']?.includes('destination') && (
              <LocationIcon
                location={{
                  locationType: 'destination',
                }}
                width={18}
                height={18}
                color="gray"
              />
            )}
            {tags['location']?.includes('salon') && (
              <LocationIcon
                location={{locationType: 'commercial'}}
                width={18}
                height={18}
                color="gray"
              />
            )}
            {tags['location']?.includes('home') && (
              <LocationIcon
                location={{locationType: 'home'}}
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
            <Group justify="center" mt="2px">
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
        </div>
        <Flex gap="xs" justify="center">
          {professions['professions'].map((p) => (
            <Badge variant="outline" c="black" color="gray.4" key={p} fw="400">
              {ProfessionTranslations[p]}
            </Badge>
          ))}
        </Flex>
      </Flex>
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
