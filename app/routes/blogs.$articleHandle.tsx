import {Box, Container, rem, Stack, Text, Title} from '@mantine/core';
import {useLoaderData, type MetaFunction} from '@remix-run/react';
import {Image} from '@shopify/hydrogen';
import {json, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {H1} from '~/components/titles/H1';

export const meta: MetaFunction<typeof loader> = ({data}) => {
  return [{title: `BySisters Blog | ${data?.article.title ?? ''}`}];
};

export async function loader({params, context}: LoaderFunctionArgs) {
  const {articleHandle} = params;

  if (!articleHandle) {
    throw new Response('Not found', {status: 404});
  }

  const {blog} = await context.storefront.query(ARTICLE_QUERY, {
    variables: {blogHandle: 'articles', articleHandle},
  });

  if (!blog?.articleByHandle) {
    throw new Response(null, {status: 404});
  }

  const article = blog.articleByHandle;

  return json({article});
}

export default function Article() {
  const {article} = useLoaderData<typeof loader>();
  const {title, image, contentHtml, author} = article;

  const publishedDate = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(article.publishedAt));

  return (
    <Box pt={rem(100)} pb={rem(50)}>
      <Container size="xl" mb="60">
        <Stack gap="xl" mb="60">
          <H1 gradients={{from: 'orange', to: 'orange.3'}}>{title}</H1>
          <Title order={2} c="dimmed" fw="normal" ta="center">
            {publishedDate}
          </Title>
        </Stack>

        {image && (
          <Image data={image} aspectRatio="1" sizes="200vw" loading="eager" />
        )}
        <Text
          dangerouslySetInnerHTML={{__html: contentHtml}}
          className="article"
        />
      </Container>
    </Box>
  );
}

// NOTE: https://shopify.dev/docs/api/storefront/latest/objects/blog#field-blog-articlebyhandle
const ARTICLE_QUERY = `#graphql
  query Article(
    $articleHandle: String!
    $blogHandle: String!
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(language: $language, country: $country) {
    blog(handle: $blogHandle) {
      articleByHandle(handle: $articleHandle) {
        title
        contentHtml
        publishedAt
        author: authorV2 {
          name
        }
        image {
          id
          altText
          url
          width
          height
        }
        seo {
          description
          title
        }
      }
    }
  }
` as const;
