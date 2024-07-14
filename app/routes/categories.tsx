import {
  Box,
  Card,
  Container,
  Divider,
  Flex,
  rem,
  SimpleGrid,
  Stack,
  Title,
  UnstyledButton,
} from '@mantine/core';
import {Link, useLoaderData} from '@remix-run/react';
import {parseGid} from '@shopify/hydrogen';
import {json, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {IconArrowRight} from '@tabler/icons-react';
import {useTranslation} from 'react-i18next';
import {Headless} from '~/components/blocks/Headless';
import {VisualTeaser} from '~/components/blocks/VisualTeaser';
import {useFilterCounts} from '~/hooks/useFilterCounts';
import {
  GET_CATEGORY_QUERY,
  GET_COLLECTION_FILTERS,
} from './categories_.$handle';
import {PAGE_QUERY} from './pages.$handle';

export const handle: Handle = {
  i18n: ['categories', 'global'],
};

export async function loader({context, params, request}: LoaderFunctionArgs) {
  const {collection: rootCollection} = await context.storefront.query(
    GET_CATEGORY_QUERY,
    {
      variables: {
        handle: 'alle-behandlinger',
      },
      cache: context.storefront.CacheLong(),
    },
  );

  const {page} = await context.storefront.query(PAGE_QUERY, {
    variables: {
      handle: 'categories',
    },
    cache: context.storefront.CacheLong(),
  });

  // we are getting rootCollectionFilters to figure out the total count of the subcollections
  const {collection: rootCollectionFilters} = await context.storefront.query(
    GET_COLLECTION_FILTERS,
    {
      variables: {
        handle: 'alle-behandlinger',
        language: 'DA',
      },
      cache: context.storefront.CacheLong(),
    },
  );

  return json({
    page,
    rootCollection,
    rootCollectionFilters: rootCollectionFilters?.products.filters || [],
  });
}

export default function Collections() {
  const {page} = useLoaderData<typeof loader>();

  return (
    <>
      <VisualTeaser data={page?.header?.reference} />
      <FeaturedCollections />
      <Headless components={page?.components} />
    </>
  );
}

function FeaturedCollections() {
  const {t} = useTranslation(['index']);
  const {rootCollection, rootCollectionFilters} =
    useLoaderData<typeof loader>();
  const collectionCount = useFilterCounts(
    rootCollectionFilters as any,
    'collectionid',
  );

  return (
    <Box py={{base: rem(20), sm: rem(40)}}>
      <Container size="xl">
        <Stack gap="xl">
          <SimpleGrid cols={{base: 1, sm: 2, md: 4}} spacing="xl">
            {rootCollection?.children?.references?.nodes.map((col) => (
              <Card key={col.id} radius="sm" withBorder>
                <UnstyledButton
                  component={Link}
                  to={`/categories/${col.handle}`}
                >
                  <Flex justify="space-between">
                    <Title order={2} size="lg">
                      {col.title} ({collectionCount[parseGid(col.id).id] || 0})
                    </Title>
                    <IconArrowRight />
                  </Flex>
                </UnstyledButton>
                <Card.Section>
                  <Divider my="sm" />
                </Card.Section>
                <Stack gap="xs">
                  {col.children?.references?.nodes.map((nesCol) => (
                    <UnstyledButton
                      key={nesCol.id}
                      component={Link}
                      to={`/categories/${col.handle}?collection=${nesCol.handle}`}
                    >
                      <Title order={2} size="lg">
                        {nesCol.title} (
                        {collectionCount[parseGid(nesCol.id).id] || 0})
                      </Title>
                    </UnstyledButton>
                  ))}
                </Stack>
              </Card>
            ))}
          </SimpleGrid>
        </Stack>
      </Container>
    </Box>
  );
}
