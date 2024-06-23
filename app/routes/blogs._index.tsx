import {
  AspectRatio,
  Box,
  Card,
  Container,
  Grid,
  rem,
  SimpleGrid,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import {Link, useLoaderData, type MetaFunction} from '@remix-run/react';
import {getPaginationVariables, Image, Pagination} from '@shopify/hydrogen';
import {json, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import type {ArticleItemFragment} from 'storefrontapi.generated';
import {H1} from '~/components/titles/H1';

export const meta: MetaFunction<typeof loader> = ({data}) => {
  return [{title: `BySisters Blog`}];
};

export const loader = async ({
  request,
  params,
  context: {storefront},
}: LoaderFunctionArgs) => {
  const paginationVariables = getPaginationVariables(request, {
    pageBy: 4,
  });

  const {blog} = await storefront.query(BLOGS_QUERY, {
    variables: {
      blogHandle: 'articles',
      ...paginationVariables,
    },
  });

  if (!blog?.articles) {
    throw new Response('Not found', {status: 404});
  }

  return json({blog});
};

export default function Blog() {
  const {blog} = useLoaderData<typeof loader>();
  const {articles} = blog;

  return (
    <Box pt={rem(100)} pb={rem(50)}>
      <Container size="xl" mb="60">
        <Stack gap="xl">
          <H1 gradients={{from: 'orange', to: 'orange.3'}}>BySisters Blog</H1>
          <Title order={2} c="dimmed" fw="normal" ta="center">
            Our articles, news, feed...
          </Title>
        </Stack>
      </Container>

      <Container size="xl">
        <Grid>
          <Grid.Col span={12}>
            <Pagination connection={articles}>
              {({nodes, isLoading, PreviousLink, NextLink}) => {
                return (
                  <>
                    <PreviousLink>
                      {isLoading ? 'Loading...' : <span>↑ Load previous</span>}
                    </PreviousLink>

                    {nodes.map((article, index) => {
                      return (
                        <ArticleItem
                          article={article}
                          key={article.id}
                          loading={index < 2 ? 'eager' : 'lazy'}
                        />
                      );
                    })}

                    <NextLink>
                      {isLoading ? 'Loading...' : <span>Load more ↓</span>}
                    </NextLink>
                  </>
                );
              }}
            </Pagination>
          </Grid.Col>
        </Grid>
      </Container>
    </Box>
  );
}

function ArticleItem({
  article,
  loading,
}: {
  article: ArticleItemFragment;
  loading?: HTMLImageElement['loading'];
}) {
  const publishedAt = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(article.publishedAt!));
  return (
    <Card withBorder component={Link} to={`/blogs/${article.handle}`}>
      <SimpleGrid cols={2}>
        <div>
          {article.image && (
            <AspectRatio>
              <Image
                alt={article.image.altText || article.title}
                aspectRatio="1/3"
                data={article.image}
                loading={loading}
                sizes="(min-width: 768px) 150vw, 140vw"
              />
            </AspectRatio>
          )}
        </div>
        <div>
          <Title order={2}>{article.title}</Title>

          <Text
            fz="h3"
            lineClamp={3}
            dangerouslySetInnerHTML={{__html: article.contentHtml}}
          ></Text>

          <Text c="dimmed" fz="h4">
            {publishedAt}
          </Text>
        </div>
      </SimpleGrid>
    </Card>
  );
}

// NOTE: https://shopify.dev/docs/api/storefront/latest/objects/blog
const BLOGS_QUERY = `#graphql
  query Blog(
    $language: LanguageCode
    $blogHandle: String!
    $first: Int
    $last: Int
    $startCursor: String
    $endCursor: String
  ) @inContext(language: $language) {
    blog(handle: $blogHandle) {
      title
      seo {
        title
        description
      }
      articles(
        first: $first,
        last: $last,
        before: $startCursor,
        after: $endCursor
      ) {
        nodes {
          ...ArticleItem
        }
        pageInfo {
          hasPreviousPage
          hasNextPage
          hasNextPage
          endCursor
          startCursor
        }

      }
    }
  }
  fragment ArticleItem on Article {
    author: authorV2 {
      name
    }
    contentHtml
    handle
    id
    image {
      id
      altText
      url
      width
      height
    }
    publishedAt
    title
    blog {
      handle
    }
  }
` as const;
