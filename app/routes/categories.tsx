import {Button, Container, Flex} from '@mantine/core';
import {
  Link,
  NavLink,
  Outlet,
  useLoaderData,
  useParams,
} from '@remix-run/react';
import {json, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {VisualTeaser} from '~/components/blocks/VisualTeaser';
import {METAFIELD_QUERY} from '~/data/fragments';
import {Categories} from '~/graphql/storefront/Categories';

export async function loader({context, request}: LoaderFunctionArgs) {
  const {collection} = await context.storefront.query(Categories);

  const {metaobject: visualTeaser} = await context.storefront.query(
    METAFIELD_QUERY,
    {
      variables: {
        handle: 'categories',
        type: 'visual_teaser',
      },
    },
  );

  return json(
    {collection, visualTeaser},
    {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=3600',
      },
    },
  );
}

export default function Collections() {
  const params = useParams();
  const {collection, visualTeaser} = useLoaderData<typeof loader>();

  return (
    <>
      <VisualTeaser component={visualTeaser} />
      <Container size="xl">
        <Flex justify="center" gap="lg" visibleFrom="sm">
          <Button
            variant="filled"
            color={
              params.handle === 'alle-behandlinger' || !params.handle
                ? 'orange'
                : 'gray.2'
            }
            c={
              params.handle === 'alle-behandlinger' || !params.handle
                ? 'white'
                : 'gray.7'
            }
            radius="xl"
            size="lg"
            component={Link}
            to="/categories"
          >
            Alle behandlinger
          </Button>

          {collection?.children?.references?.nodes.map((collection) => (
            <NavLink
              key={collection.id}
              to={`/categories/${collection.handle}`}
            >
              {({isActive}) => (
                <Button
                  variant="filled"
                  color={isActive ? 'orange' : 'gray.2'}
                  c={isActive ? 'white' : 'gray.7'}
                  radius="xl"
                  size="lg"
                >
                  {collection.title}
                </Button>
              )}
            </NavLink>
          ))}
        </Flex>
      </Container>

      <Outlet />
    </>
  );
}
