import {
  Button,
  Container,
  Divider,
  Drawer,
  Flex,
  Group,
  InputLabel,
  Radio,
  ScrollArea,
  Select,
  Stack,
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
  IconGenderFemale,
  IconNetwork,
  IconServicemark,
  IconX,
} from '@tabler/icons-react';
import {useMemo} from 'react';
import {useTranslation} from 'react-i18next';
import {type CategoriesStorefrontQuery} from 'storefrontapi.generated';
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
  AddLanguageFilter,
  RemoveLanguageFilterButton,
} from '~/components/filters/LanguageFilter';
import {
  AddLocationFilter,
  RemoveLocationFilterButton,
} from '~/components/filters/LocationFilter';
import {ProfessionButton} from '~/components/ProfessionButton';
import {getTags} from '~/lib/tags';
import {COLLECTION} from './business.services.create';
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

  const {collection} = await context.storefront.query(COLLECTION);

  const {page} = await context.storefront.query(PAGE_QUERY, {
    variables: {
      handle: 'artists',
    },
    cache: context.storefront.CacheLong(),
  });

  return json({
    page,
    tags,
    collection,
  });
};

export default function Artists() {
  const {tags, page, collection} = useLoaderData<typeof loader>();

  return (
    <>
      <VisualTeaser data={page?.header?.reference} />

      <Container size="xl">
        <Stack gap="xl">
          <CategoriesAndFilters tags={tags} collection={collection} />
          <Outlet />
        </Stack>
      </Container>

      <Divider />

      <Headless components={page?.components} />
    </>
  );
}

function CategoriesAndFilters({
  tags,
  collection,
}: {
  tags: Record<string, string[]>;
  collection: CategoriesStorefrontQuery['collection'];
}) {
  const {t} = useTranslation(['users', 'professions']);
  const [opened, {open, close}] = useDisclosure(false);
  const [searchParams, setSearchParams] = useSearchParams();

  const products = useMemo(
    () =>
      collection?.children?.references?.nodes.reduce((products, collection) => {
        collection.products.nodes.forEach((product) => {
          products.push({
            value: parseGid(product.id).id,
            label: `${collection.title}: ${product.title}`,
          });
        });
        return products;
      }, [] as Array<{value: string; label: string}>),
    [collection?.children?.references?.nodes],
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

  const genderValue = searchParams.get('gender');
  const onChangeGender = (value: string | null) => {
    setSearchParams(
      (prev) => {
        if (value) {
          prev.set('gender', value);
        } else {
          prev.delete('gender');
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
          {tags['profession']
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
              {genderValue ? (
                <Button
                  variant="outline"
                  c="black"
                  color="gray.3"
                  onClick={() => onChangeGender(null)}
                  size="md"
                  rightSection={<IconX />}
                  leftSection={<IconGenderFemale />}
                >
                  {genderValue === 'woman' && t('users:gender_woman')}
                  {genderValue === 'man' && t('users:gender_men')}
                </Button>
              ) : null}
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
            data={tags['profession'].map((p) => ({
              label: `${t(p as any, {ns: 'professions'})[0].toUpperCase()}${t(
                p as any,
                {ns: 'professions'},
              ).substring(1)}`,
              value: p,
            }))}
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
          <AddDayFilter />
          <AddLanguageFilter />
          <div>
            <Group gap="xs" mb="xs">
              <IconGenderFemale />
              <InputLabel size="md">{t('users:gender_label')}</InputLabel>
            </Group>
            <Radio.Group value={genderValue} onChange={onChangeGender}>
              <Stack gap="3px">
                <Radio value={null!} label={t('users:gender_all')} />
                <Radio value="woman" label={t('users:gender_woman')} />
                <Radio value="man" label={t('users:gender_men')} />
              </Stack>
            </Radio.Group>
          </div>
        </Stack>
      </Drawer>
    </>
  );
}
