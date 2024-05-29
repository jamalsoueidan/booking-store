import {
  BackgroundImage,
  Badge,
  Button,
  Flex,
  Image,
  Mark,
  rem,
  SimpleGrid,
  Stack,
  Text,
  UnstyledButton,
} from '@mantine/core';
import {Link, useLoaderData} from '@remix-run/react';
import {getPaginationVariables, Pagination} from '@shopify/hydrogen';
import {type ArticleSortKeys} from '@shopify/hydrogen/storefront-api-types';
import {
  json,
  type LoaderFunctionArgs,
  type MetaFunction,
} from '@shopify/remix-oxygen';
import {type ArticleUserFragment} from 'storefrontapi.generated';
import {METAFIELD_QUERY} from '~/data/fragments';
import {ARTICLE_USER_FRAGMENT} from '~/graphql/fragments/ArtistUser';
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

  const paginationVariables = getPaginationVariables(request, {
    pageBy: 5,
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
          <SimpleGrid cols={{base: 1, sm: 2, md: 4}}>
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
  const professions = JSON.parse(
    user?.professions?.value || '[]',
  ) as Array<string>;

  const tags = splitTags(article.tags);

  return (
    <UnstyledButton
      component={Link}
      to={`/artist/${user?.username?.value}`}
      style={{
        borderRadius: '3%',
        border: '1px solid #ccc',
        position: 'relative',
      }}
    >
      <BackgroundImage
        component={Image}
        mih={rem(300)}
        src={
          user?.image?.reference?.image?.url ||
          'https://placehold.co/400x600?text=Ekspert'
        }
        style={{
          borderTopLeftRadius: '3.2%',
          borderTopRightRadius: '3.2%',
        }}
      />

      <Mark
        color="black"
        c="white"
        style={{
          position: 'absolute',
          right: 1,
          top: 1,
          borderBottomLeftRadius: '15%',
          borderTopRightRadius: '15%',
          padding: '5px',
          opacity: 0.7,
        }}
      >
        {tags['city'][0].toUpperCase()}
      </Mark>

      <Stack p="xs" pb="xs" pt="6px" gap="6px">
        <div>
          <Text fz="md" fw={600} c="black">
            {user?.fullname?.value}
          </Text>
          <Text fz="sm" c="#666">
            {user?.shortDescription?.value}
          </Text>
        </div>
        <Flex gap="3px">
          {professions.map((p) => (
            <Badge variant="outline" c="black" color="gray.4" key={p} fw="400">
              {ProfessionTranslations[p]}
            </Badge>
          ))}
        </Flex>
      </Stack>
    </UnstyledButton>
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
