import {
  Box,
  Button,
  Container,
  Drawer,
  Flex,
  getGradient,
  ScrollArea,
  Select,
  Stack,
  useMantineTheme,
} from '@mantine/core';
import {useDisclosure} from '@mantine/hooks';
import {
  Outlet,
  useLoaderData,
  useSearchParams,
  type ShouldRevalidateFunction,
} from '@remix-run/react';
import {parseGid} from '@shopify/hydrogen';
import {
  json,
  type LoaderFunctionArgs,
  type MetaFunction,
} from '@shopify/remix-oxygen';
import {
  IconArrowDown,
  IconArrowsSort,
  IconFilter,
  IconNetwork,
  IconServicemark,
  IconX,
} from '@tabler/icons-react';
import {useMemo} from 'react';
import {useTranslation} from 'react-i18next';
import {type ArticleCollectionIdsTagQuery} from 'storefrontapi.generated';
import {Headless} from '~/components/blocks/Headless';
import {VisualTeaser} from '~/components/blocks/VisualTeaser';
import {
  AddCityFilter,
  RemoveCityFilterButton,
} from '~/components/filters/CityFilter';
import {
  AddDayFilter,
  RemoveDayFilterButton,
} from '~/components/filters/DayFilter';
import {
  AddGenderFilter,
  RemoveGenderFilterButton,
} from '~/components/filters/GenderFilter';
import {
  AddLanguageFilter,
  RemoveLanguageFilterButton,
} from '~/components/filters/LanguageFilter';
import {
  AddLocationFilter,
  RemoveLocationFilterButton,
} from '~/components/filters/LocationFilter';
import {ProfessionButton} from '~/components/ProfessionButton';
import {getTags} from '~/lib/tags';
import {PAGE_QUERY} from './pages.$handle';

export const handle: Handle = {
  i18n: ['users', 'professions'],
};

export const meta: MetaFunction<typeof loader> = ({data}) => {
  return [
    {
      title: `BySisters: ${data?.page?.seo?.title}`,
    },
  ];
};

export const shouldRevalidate: ShouldRevalidateFunction = ({
  currentParams,
  nextParams,
}) => {
  const {handle: previousHandle} = currentParams;
  const {handle: nextHandle} = nextParams;
  return nextHandle !== previousHandle;
};

export const loader = async (args: LoaderFunctionArgs) => {
  const {context} = args;

  const tags = await getTags(
    context.env.PUBLIC_STORE_DOMAIN,
    context.env.PRIVATE_API_ACCESS_TOKEN,
  );

  const {collections} = await context.storefront.query(
    ARTICLE_COLLECTION_IDS_TAG_QUERY,
    {
      variables: {
        query: tags['collectionid']?.join(' OR ') || '',
      },
    },
  );

  const {page} = await context.storefront.query(PAGE_QUERY, {
    variables: {
      handle: 'artists',
    },
    cache: context.storefront.CacheLong(),
  });

  return json({
    page,
    tags,
    collections,
  });
};

export default function Artists() {
  const theme = useMantineTheme();
  const {tags, page, collections} = useLoaderData<typeof loader>();

  return (
    <>
      <VisualTeaser data={page?.header?.reference} />

      <Box
        bg={getGradient({deg: 180, from: 'white', to: 'red.0'}, theme)}
        style={{position: 'relative', overflow: 'hidden'}}
      >
        <Container size="xl">
          <Stack gap="xl">
            <CategoriesAndFilters tags={tags} collections={collections} />
            <Outlet />
          </Stack>
        </Container>
      </Box>

      <Headless components={page?.components} />
    </>
  );
}

function CategoriesAndFilters({
  tags,
  collections,
}: {
  tags: Record<string, string[] | null>;
  collections: ArticleCollectionIdsTagQuery['collections'];
}) {
  const {t} = useTranslation(['users', 'professions']);
  const [opened, {open, close}] = useDisclosure(false);
  const [searchParams, setSearchParams] = useSearchParams();

  const products = useMemo(
    () =>
      collections.nodes.map((collection) => ({
        value: parseGid(collection.id).id,
        label: collection.title,
      })),
    [collections],
  );

  const sortValue = searchParams.get('sort');
  const onChangeSort = (value: string | null) => {
    setSearchParams(
      (prev) => {
        if (value) {
          prev.set('sort', value);
        } else {
          prev.delete('sort');
        }
        return prev;
      },
      {preventScrollReset: true},
    );
  };

  const professionSearchParams = searchParams.get('profession') || '';
  const onChangeProfession = (value: string | null) => {
    setSearchParams(
      (prev) => {
        if (value) {
          prev.set('profession', value);
        } else {
          prev.delete('profession');
        }
        return prev;
      },
      {preventScrollReset: true},
    );
  };

  const productSearchParams = searchParams.get('product') || '';
  const selectedProduct = products?.find(
    (product) => product.value === productSearchParams,
  );
  const onChangeProduct = (value: string | null) => {
    setSearchParams(
      (prev) => {
        if (value) {
          prev.set('product', value);
        } else {
          prev.delete('product');
        }
        return prev;
      },
      {preventScrollReset: true},
    );
  };

  return (
    <>
      <ScrollArea h="auto" type="auto" py={{base: 'md', sm: undefined}}>
        <Flex gap={{base: 'sm', sm: 'lg'}} justify="center">
          <ProfessionButton profession={'all'} reset />
          {tags['profession'] &&
            tags['profession']
              .sort((a, b) => {
                const translatedA = t(a as any, {ns: 'professions'}) || a;
                const translatedB = t(b as any, {ns: 'professions'}) || b;
                return translatedA.localeCompare(translatedB);
              })
              .map((profession) => (
                <ProfessionButton key={profession} profession={profession} />
              ))}
        </Flex>
      </ScrollArea>
      <Flex direction="column" justify="center" gap="md">
        <Flex justify="center" gap="md">
          <Button
            variant="outline"
            c="black"
            color="gray.3"
            onClick={open}
            size="xl"
            leftSection={<IconFilter />}
            rightSection={<IconArrowDown />}
          >
            {t('users:filters')}
          </Button>
        </Flex>
        <Flex justify="center" gap="md" wrap="wrap">
          {searchParams.size > 0 ? (
            <>
              {professionSearchParams ? (
                <Button
                  variant="outline"
                  c="black"
                  color="gray.3"
                  onClick={() => onChangeProfession(null)}
                  size="md"
                  rightSection={<IconX />}
                  leftSection={<IconNetwork />}
                >
                  {`${t(professionSearchParams as any, {
                    ns: 'professions',
                  })[0].toUpperCase()}${t(professionSearchParams as any, {
                    ns: 'professions',
                  }).substring(1)}`}
                </Button>
              ) : null}
              {selectedProduct ? (
                <Button
                  variant="outline"
                  c="black"
                  color="gray.3"
                  onClick={() => onChangeProduct(null)}
                  size="md"
                  rightSection={<IconX />}
                  leftSection={<IconServicemark />}
                >
                  {selectedProduct.label}
                </Button>
              ) : null}
              <RemoveCityFilterButton />
              {sortValue ? (
                <Button
                  variant="outline"
                  c="black"
                  color="gray.3"
                  onClick={() => onChangeSort(null)}
                  size="md"
                  rightSection={<IconX />}
                  leftSection={<IconArrowsSort />}
                >
                  {t('users:sorting')}
                </Button>
              ) : null}
              <RemoveLocationFilterButton />
              <RemoveGenderFilterButton />
              <RemoveDayFilterButton />
              <RemoveLanguageFilterButton />
            </>
          ) : null}
        </Flex>
      </Flex>

      <Drawer
        position="right"
        opened={opened}
        onClose={close}
        overlayProps={{backgroundOpacity: 0.3, blur: 2}}
      >
        <Stack gap="xl">
          <Select
            size="md"
            value={professionSearchParams}
            label={t('users:profession_label')}
            placeholder={t('users:profession_placeholder')}
            onChange={onChangeProfession}
            leftSection={<IconNetwork />}
            data={
              tags['profession']
                ? tags['profession'].map((p) => ({
                    label: `${t(p as any, {
                      ns: 'professions',
                    })[0].toUpperCase()}${t(p as any, {
                      ns: 'professions',
                    }).substring(1)}`,
                    value: p,
                  }))
                : []
            }
            clearable
          />
          <Select
            size="md"
            value={productSearchParams}
            label={t('users:treatments_label')}
            placeholder={t('users:treatments_placeholder')}
            onChange={onChangeProduct}
            leftSection={<IconServicemark />}
            data={products}
            clearable
          />
          <AddCityFilter tags={tags['city']} />
          <Select
            size="md"
            value={sortValue}
            label={t('users:sorting_by_label')}
            leftSection={<IconArrowsSort />}
            placeholder={t('users:sorting_by_placeholder')}
            onChange={onChangeSort}
            data={[
              {label: t('users:sorting_by_name'), value: 'title'},
              {label: t('users:sorting_by_newest'), value: 'published_at'},
              {
                label: t('users:sorting_by_oldest'),
                value: 'reverse',
              },
            ]}
            clearable
          />
          <AddLocationFilter tags={tags['location_type']} />
          <AddDayFilter tags={tags['day']} />
          <AddLanguageFilter tags={tags['speak']} />
          <AddGenderFilter tags={tags['gender']} />
        </Stack>
      </Drawer>
    </>
  );
}

export const ARTICLE_COLLECTION_IDS_TAG_QUERY = `#graphql
  query ArticleCollectionIdsTag(
    $country: CountryCode, $language: LanguageCode, $query: String!
  ) @inContext(country: $country, language: $language) {
    collections(first: 10, query: $query) {
      nodes {
        id
        title
      }
    }
  }
` as const;
