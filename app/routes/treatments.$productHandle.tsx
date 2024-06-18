import {
  Avatar,
  Button,
  Card,
  Container,
  Drawer,
  Flex,
  rem,
  Select,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import {Outlet, useLoaderData, useSearchParams} from '@remix-run/react';
import {UNSTABLE_Analytics as Analytics} from '@shopify/hydrogen';
import {
  json,
  type LoaderFunctionArgs,
  type MetaFunction,
} from '@shopify/remix-oxygen';

import {useDisclosure} from '@mantine/hooks';
import {
  IconArrowDown,
  IconArrowsSort,
  IconFilter,
  IconGps,
} from '@tabler/icons-react';
import {AddCityFilter} from '~/components/filters/CityFilter';
import {AddDayFilter} from '~/components/filters/DayFilter';
import {AddLocationFilter} from '~/components/filters/LocationFilter';
import {AddPriceFilter} from '~/components/filters/PriceFilter';
import {ResetFilter} from '~/components/filters/ResetFilter';
import {USER_COLLECTION_FILTER} from '~/graphql/fragments/UserCollectionFilter';
import {TranslationProvider, useTranslations} from '~/providers/Translation';
import {PAGE_QUERY} from './pages.$handle';

export const meta: MetaFunction<typeof loader> = ({data}) => {
  return [{title: `BySisters | ${data?.product.title ?? ''}`}];
};

export async function loader({params, context}: LoaderFunctionArgs) {
  const {productHandle} = params;
  const {storefront} = context;

  if (!productHandle) {
    throw new Error('Expected product handle to be defined');
  }

  const {product} = await storefront.query(
    GET_TREATMENT_WITH_COLLECTION_HANDLE,
    {
      variables: {
        productHandle,
      },
      cache: storefront.CacheLong(),
    },
  );

  if (!product) {
    throw new Response(`Product ${productHandle} not found`, {
      status: 404,
    });
  }

  if (!product.collection?.reference) {
    throw new Response(`Product > collection not found`, {
      status: 404,
    });
  }

  const {collection: collectionFiltersOnly} = await storefront.query(
    FILTER_COLLECTION,
    {
      variables: {
        handle: product.collection.reference.handle,
        language: 'DA',
      },
      cache: storefront.CacheLong(),
    },
  );

  const {page} = await context.storefront.query(PAGE_QUERY, {
    variables: {
      handle: 'treatments',
    },
    cache: context.storefront.CacheLong(),
  });

  return json({
    product,
    page,
    filters: collectionFiltersOnly?.products.filters || [],
  });
}

interface PriceRange {
  price: {
    min: number;
    max: number;
  };
}

export default function Product() {
  const {product, page} = useLoaderData<typeof loader>();

  return (
    <TranslationProvider data={page?.translations}>
      <Container size="xl">
        <Header />
        <Stats />

        <Outlet />

        <Analytics.ProductView
          data={{
            products: [
              {
                id: product.id,
                title: product.title,
                price: product.variants.nodes[0].price.amount || '0',
                vendor: product.vendor,
                variantId: product.variants.nodes[0].id || '',
                variantTitle: product.title || '',
                quantity: 1,
              },
            ],
          }}
        />
      </Container>
    </TranslationProvider>
  );
}

function Header() {
  const {product, filters} = useLoaderData<typeof loader>();
  const {t} = useTranslations();
  const [searchParams, setSearchParams] = useSearchParams();
  const [opened, {open, close}] = useDisclosure(false);

  const price = filters.find((p) => p.id === 'filter.v.price')?.values[0];

  const priceRange = price
    ? (JSON.parse(price.input as string) as PriceRange)
    : {price: {min: 0, max: 0}};

  const tags = filters.find((p) => p.id === 'filter.p.tag');

  const cities =
    tags?.values
      .filter((p) => p.label.includes('city'))
      .map((c) => {
        const [tag, ...rest] = c.label.split('-');
        return rest.join('-');
      }) || [];

  const locations =
    tags?.values
      .filter((p) => p.label.includes('location_type'))
      .map((c) => {
        const [tag, ...rest] = c.label.split('-');
        return rest.join('-');
      }) || [];

  const onChangeSort = (value: string | null) => {
    setSearchParams(
      (prev) => {
        if (value) {
          prev.set('sort', value.toLowerCase());
        } else {
          prev.delete('sort');
        }
        return prev;
      },
      {preventScrollReset: true},
    );
  };

  const map = String(searchParams.get('map'));
  const onChangeMap = (value: string | null) => {
    setSearchParams(
      (prev) => {
        if (value) {
          prev.set('map', value);
        } else {
          prev.delete('map');
        }
        return prev;
      },
      {preventScrollReset: true},
    );
  };

  return (
    <>
      <Flex
        direction={{base: 'column', sm: 'row'}}
        mt={rem(100)}
        mb="xl"
        align="center"
        gap="lg"
      >
        <Flex direction="row" gap={{base: 'sm', sm: 'lg'}}>
          <Avatar
            alt={product.featuredImage?.altText || 'Product Image'}
            src={product.featuredImage?.url}
            size={rem(120)}
            style={{border: '3px solid rgba(243, 175, 228, 0.7)'}}
          />
          <Flex direction="column" justify="center">
            <Title order={1} fz={{base: 'xl', sm: 'h1'}} mt="-5px">
              {product?.title}
            </Title>

            <Text fz={{base: 'sm', sm: 'xl'}} c="dimmed" fw={400} lineClamp={3}>
              {product.description}
            </Text>
          </Flex>
        </Flex>
        <Flex justify={{base: 'center', sm: 'flex-end'}} gap="md" miw="40%">
          <ResetFilter />
          <Button
            variant="outline"
            c="black"
            color="gray.3"
            bg="white"
            onClick={open}
            size="xl"
            leftSection={<IconFilter />}
            rightSection={<IconArrowDown />}
          >
            {t('treatments_filter')}
          </Button>
          <Button
            variant="outline"
            c="black"
            color="gray.3"
            bg="white"
            onClick={() => onChangeMap(map === 'hide' ? null : 'hide')}
            size="xl"
            rightSection={<IconGps />}
            visibleFrom="sm"
          >
            {map === 'hide' ? t('show') : t('hide')} {t('treatments_map')}
          </Button>
        </Flex>
      </Flex>

      <Drawer
        position="right"
        opened={opened}
        onClose={close}
        overlayProps={{backgroundOpacity: 0.3, blur: 2}}
      >
        <Stack gap="xl">
          <AddCityFilter tags={cities} />
          <Select
            size="md"
            label={t('treatments_sort_label')}
            placeholder={t('treatments_sort_placeholder')}
            onChange={onChangeSort}
            leftSection={<IconArrowsSort />}
            data={[
              {label: t('treatments_sort_newest'), value: 'newest'},
              {label: t('treatments_sort_cheapest'), value: 'cheapest'},
              {label: t('treatments_sort_expensive'), value: 'expensive'},
            ]}
            clearable
          />
          <AddPriceFilter
            min={priceRange.price.min}
            max={priceRange.price.max}
          />
          <AddLocationFilter tags={locations} />
          <AddDayFilter />
        </Stack>
      </Drawer>
    </>
  );
}

function Stats() {
  const {product, filters} = useLoaderData<typeof loader>();
  const {t} = useTranslations();
  const tags = filters.find((p) => p.id === 'filter.p.tag');

  const availability = filters
    .find((k) => k.id === 'filter.v.availability')
    ?.values.find((p) => (p.input as any)?.includes('true')) || {count: 0};

  const cityCount =
    tags?.values
      .filter((p) => p.label.includes('city'))
      .reduce((total, city) => {
        return total + city.count;
      }, 0) || 0;

  return (
    <Card
      radius="md"
      withBorder
      bg="rgba(243, 175, 228, 0.15)"
      style={{border: '1px solid rgba(243, 175, 228, 0.25)'}}
      mt={rem(15)}
      mb={rem(30)}
    >
      <Flex
        direction={{base: 'column', sm: 'row'}}
        justify="space-between"
        gap={{base: 'md'}}
      >
        <Flex gap="xl" wrap="wrap">
          <Flex direction="column" justify="center">
            <Text tt="uppercase" ta="center" fz="sm" c="gray" fw="400">
              {t('treatments_category')}
            </Text>
            <Text ta="center" fw="600">
              {product.productType}
            </Text>
          </Flex>
          <Flex direction="column" justify="center">
            <Text tt="uppercase" ta="center" fz="sm" c="gray" fw="400">
              {t('treatments_beauty_expert')}
            </Text>
            <Text ta="center" fw="600">
              {availability?.count}
            </Text>
          </Flex>
          <Flex direction="column" justify="center">
            <Text tt="uppercase" ta="center" fz="sm" c="gray" fw="400">
              {t('treatments_cities')}
            </Text>
            <Text ta="center">{cityCount}</Text>
          </Flex>
        </Flex>
      </Flex>
    </Card>
  );
}

const TREATMENT_WITH_COLLECTION_HANDLER_FRAGMENT = `#graphql
  fragment TreatmentWithCollectionHandler on Product {
    id
    title
    description
    productType
    handle
    vendor
    featuredImage {
      id
      altText
      url(transform: { maxHeight: 250, maxWidth: 250, crop: CENTER })
      width
      height
    }
    variants(first: 1) {
      nodes {
        id
        compareAtPrice {
          amount
          currencyCode
        }
        price {
          amount
          currencyCode
        }
      }
    }
    collection: metafield(key: "collection", namespace: "system") {
      reference {
        ... on Collection {
          handle
          title
        }
      }
    }
  }
` as const;

const GET_TREATMENT_WITH_COLLECTION_HANDLE = `#graphql
  ${TREATMENT_WITH_COLLECTION_HANDLER_FRAGMENT}

  query GetProductWithCollectionHandle(
    $productHandle: String!
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    product(handle: $productHandle) {
      ...TreatmentWithCollectionHandler
    }
  }
` as const;

const FILTER_COLLECTION = `#graphql
  ${USER_COLLECTION_FILTER}
  query TreatmentFilterCollection(
    $handle: String!
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    collection(handle: $handle) {
      products(first: 1) {
        filters {
          ...UserCollectionFilter
        }
      }
    }
  }
` as const;
