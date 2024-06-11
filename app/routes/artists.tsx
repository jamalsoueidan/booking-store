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
  type ShouldRevalidateFunction,
  useLoaderData,
  useSearchParams,
} from '@remix-run/react';
import {parseGid} from '@shopify/hydrogen';
import {json, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
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
import {
  METAFIELD_QUERY,
  METAFIELD_VISUAL_TEASER_QUERY,
} from '~/graphql/queries/Metafield';
import {getTags} from '~/lib/tags';
import {COLLECTION} from './account.services.create';
import {ProfessionTranslations} from './api.users.professions';

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

  const {metaobject: visualTeaser} = await context.storefront.query(
    METAFIELD_VISUAL_TEASER_QUERY,
    {
      variables: {
        handle: 'artists',
        type: 'visual_teaser',
      },
    },
  );

  const {metaobject: components} = await context.storefront.query(
    METAFIELD_QUERY,
    {
      variables: {
        handle: 'artists',
        type: 'components',
      },
    },
  );

  return json({
    components,
    visualTeaser,
    tags,
    collection,
  });
};

export default function Artists() {
  const {tags, components, visualTeaser, collection} =
    useLoaderData<typeof loader>();
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
      {visualTeaser && <VisualTeaser data={visualTeaser} />}

      <Container size="xl">
        <Stack gap="xl">
          <ScrollArea h="auto" type="auto" py={{base: 'md', sm: undefined}}>
            <Flex gap={{base: 'sm', sm: 'lg'}} justify="center">
              <ProfessionButton profession={'all'} reset />
              {tags['profession']
                .sort((a, b) => {
                  const translatedA = ProfessionTranslations[a] || a;
                  const translatedB = ProfessionTranslations[b] || b;
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
                Filtre
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
                      {`${ProfessionTranslations[
                        professionSearchParams
                      ][0].toUpperCase()}${ProfessionTranslations[
                        professionSearchParams
                      ].substring(1)}`}
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
                      Sortering
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
                      {genderValue === 'woman' && 'Kvinder'}
                      {genderValue === 'man' && 'Mænd'}
                    </Button>
                  ) : null}
                  <RemoveDayFilterButton />
                  <RemoveLanguageFilterButton />
                </>
              ) : null}
            </Flex>
          </Flex>
          <Outlet />
        </Stack>
      </Container>

      <Divider />

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
            label="Skønhedseksperter profession:"
            placeholder="Alle professioner"
            onChange={onChangeProfession}
            leftSection={<IconNetwork />}
            data={tags['profession'].map((p) => ({
              label: `${ProfessionTranslations[
                p
              ][0].toUpperCase()}${ProfessionTranslations[p].substring(1)}`,
              value: p,
            }))}
            clearable
          />
          <Select
            size="md"
            value={productSearchParams}
            label="Behandlinger:"
            placeholder="Alle behandlinger"
            onChange={onChangeProduct}
            leftSection={<IconServicemark />}
            data={products}
            clearable
          />
          <AddCityFilter tags={tags['city']} />
          <Select
            size="md"
            value={sortValue}
            label="Sortere skønhedseksperter efter:"
            leftSection={<IconArrowsSort />}
            placeholder="Vælge sortering"
            onChange={onChangeSort}
            data={[
              {label: 'Navn', value: 'title'},
              {label: 'Nyeste tilføjet', value: 'published_at'},
              {label: 'Ældest tilføjet', value: 'reverse'},
            ]}
            clearable
          />
          <AddLocationFilter tags={tags['location_type']} />
          <AddDayFilter />
          <AddLanguageFilter />
          <div>
            <Group gap="xs" mb="xs">
              <IconGenderFemale />
              <InputLabel size="md">Skønhedsekspert køn?</InputLabel>
            </Group>
            <Radio.Group value={genderValue} onChange={onChangeGender}>
              <Stack gap="3px">
                <Radio value={null!} label="Begge" />
                <Radio value="woman" label="Kvinder" />
                <Radio value="man" label="Mænd" />
              </Stack>
            </Radio.Group>
          </div>
        </Stack>
      </Drawer>

      <Headless components={components?.components} />
    </>
  );
}
