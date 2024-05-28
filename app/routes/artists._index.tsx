import {
  Badge,
  Button,
  Flex,
  Image,
  rem,
  SimpleGrid,
  Stack,
  Text,
  UnstyledButton,
} from '@mantine/core';
import {Link, useLoaderData} from '@remix-run/react';
import {
  getPaginationVariables,
  Pagination,
  Image as ShopifyImage,
} from '@shopify/hydrogen';
import {type ArticleSortKeys} from '@shopify/hydrogen/storefront-api-types';
import {
  json,
  type LoaderFunctionArgs,
  type MetaFunction,
} from '@shopify/remix-oxygen';
import {type ArticleUserFragment} from 'storefrontapi.generated';
import {METAFIELD_QUERY} from '~/data/fragments';
import {ARTICLE_USER_FRAGMENT} from '~/graphql/fragments/ArtistUser';
import {ProfessionTranslations} from './api.users.professions';

export const meta: MetaFunction = () => {
  return [{title: `BySisters | Find Skønhedseksperter`}];
};

export const loader = async ({context, request}: LoaderFunctionArgs) => {
  const {storefront} = context;

  const url = new URL(request.url);
  const searchParams = new URLSearchParams(url.search);

  const query = [];
  let sortKey: ArticleSortKeys = 'PUBLISHED_AT';
  let reverse = false;

  const sort = searchParams.get('sort');
  if (sort === 'published_at' || sort === 'reverse') {
    sortKey = 'PUBLISHED_AT';
  }

  if (sort === 'published_at') {
    reverse = true;
  }

  if (sort === 'name') {
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
  const paginationVariables = getPaginationVariables(request, {
    pageBy: 5,
  });

  const {data} = await storefront.query(USERS_QUERY, {
    variables: {
      sortKey,
      reverse,
      ...(query.length > 0 ? {query: query.join(' OR ')} : {}),
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

  return (
    <UnstyledButton
      component={Link}
      to={`/artist/${user?.username?.value}`}
      style={{borderRadius: '3%', border: '1px solid #ccc'}}
    >
      <Image
        component={ShopifyImage}
        sizes="(min-width: 45em) 50vw, 100vw"
        aspectRatio="2/5"
        src={user?.image?.reference?.image?.url}
        style={{
          borderTopLeftRadius: '3%',
          borderTopRightRadius: '3%',
        }}
        fallbackSrc="https://placehold.co/400x600?text=Ekspert"
        loading="lazy"
      />
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
