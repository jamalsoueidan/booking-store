import {Button, Container, Flex, Select} from '@mantine/core';
import {
  Link,
  NavLink,
  Outlet,
  useLoaderData,
  useNavigate,
  useParams,
} from '@remix-run/react';
import {json, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {Headless} from '~/components/blocks/Headless';
import {VisualTeaser} from '~/components/blocks/VisualTeaser';
import {CATEGORIES} from '~/graphql/storefront/Categories';
import {TranslationProvider, useTranslations} from '~/providers/Translation';
import {PAGE_QUERY} from './pages.$handle';

export async function loader({context}: LoaderFunctionArgs) {
  const {collection} = await context.storefront.query(CATEGORIES);

  const {page} = await context.storefront.query(PAGE_QUERY, {
    variables: {
      handle: 'categories',
    },
    cache: context.storefront.CacheLong(),
  });

  return json({page, collection});
}

export default function Collections() {
  const {page} = useLoaderData<typeof loader>();

  return (
    <TranslationProvider data={page?.translations}>
      <VisualTeaser data={page?.header?.reference} />
      <PickCategory />
      <Outlet />
      <Headless components={page?.components} />
    </TranslationProvider>
  );
}

function PickCategory() {
  const {t} = useTranslations();
  const params = useParams();
  const navigate = useNavigate();
  const {collection} = useLoaderData<typeof loader>();

  const data = [
    {label: t('categories_all_treatments'), value: ''},
    ...(collection?.children?.references?.nodes || []).map((collection) => ({
      label: collection.title,
      value: collection.handle,
    })),
  ];

  return (
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
          {t('categories_all_treatments')}
        </Button>

        {collection?.children?.references?.nodes.map((collection) => (
          <NavLink key={collection.id} to={`/categories/${collection.handle}`}>
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
      <Flex justify="center" gap="lg" hiddenFrom="sm">
        <Select
          placeholder={t('categories_all_treatments')}
          size="lg"
          onChange={(value) => {
            if (!value) {
              navigate(`/categories`);
            } else {
              navigate(`/categories/${value}`);
            }
          }}
          data={data}
        />
      </Flex>
    </Container>
  );
}
