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
import {TranslationProvider, useTranslations} from '~/providers/Translation';
import {COLLECTION} from './account.services.create';
import {PAGE_QUERY} from './pages.$handle';

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
    <TranslationProvider data={page?.translations}>
      <VisualTeaser data={page?.header?.reference} />

      <Container size="xl">
        <Stack gap="xl">
          <CategoriesAndFilters tags={tags} collection={collection} />
          <Outlet />
        </Stack>
      </Container>

      <Divider />

      <Headless components={page?.components} />
    </TranslationProvider>
  );
}

function CategoriesAndFilters({
  tags,
  collection,
}: {
  tags: Record<string, string[]>;
  collection: CategoriesStorefrontQuery['collection'];
}) {
  const {t} = useTranslations();
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
              const translatedA = t(`profession_${a}`) || a;
              const translatedB = t(`profession_${b}`) || b;
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
            {t('artists_filters')}
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
                  {`${t(
                    `profession_${professionSearchParams}`,
                  )[0].toUpperCase()}${t(
                    `profession_${professionSearchParams}`,
                  ).substring(1)}`}
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
                  {t('artists_sorting')}
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
                  {genderValue === 'woman' && t('artists_gender_woman')}
                  {genderValue === 'man' && t('artists_gender_men')}
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
            label={t('artists_profession_label')}
            placeholder={t('artists_profession_placeholder')}
            onChange={onChangeProfession}
            leftSection={<IconNetwork />}
            data={tags['profession'].map((p) => ({
              label: `${t(`profession_${p}`)[0].toUpperCase()}${t(
                `profession_${p}`,
              ).substring(1)}`,
              value: p,
            }))}
            clearable
          />
          <Select
            size="md"
            value={productSearchParams}
            label={t('artists_treatments_label')}
            placeholder={t('artists_treatments_placeholder')}
            onChange={onChangeProduct}
            leftSection={<IconServicemark />}
            data={products}
            clearable
          />
          <AddCityFilter tags={tags['city']} />
          <Select
            size="md"
            value={sortValue}
            label={t('artists_sorting_by_label')}
            leftSection={<IconArrowsSort />}
            placeholder={t('artists_sorting_by_placeholder')}
            onChange={onChangeSort}
            data={[
              {label: t('artists_sorting_by_name'), value: 'title'},
              {label: t('artists_sorting_by_newest'), value: 'published_at'},
              {
                label: t('artists_sorting_by_oldest'),
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
              <InputLabel size="md">{t('artists_gender_label')}</InputLabel>
            </Group>
            <Radio.Group value={genderValue} onChange={onChangeGender}>
              <Stack gap="3px">
                <Radio value={null!} label={t('artists_gender_all')} />
                <Radio value="woman" label={t('artists_gender_woman')} />
                <Radio value="man" label={t('artists_gender_men')} />
              </Stack>
            </Radio.Group>
          </div>
        </Stack>
      </Drawer>
    </>
  );
}
