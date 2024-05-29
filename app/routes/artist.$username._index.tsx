import {defer, type LoaderFunctionArgs} from '@shopify/remix-oxygen';

import {
  Button,
  Flex,
  SimpleGrid,
  Skeleton,
  Stack,
  Text,
  Title,
  rem,
} from '@mantine/core';
import '@mantine/tiptap/styles.css';
import {Await, Link, useLoaderData, useSearchParams} from '@remix-run/react';
import {Suspense} from 'react';
import {ArtistProduct} from '~/components/artist/ArtistProduct';
import {GET_USER_PRODUCTS} from '~/graphql/queries/GetUserProducts';
import {useUser} from '~/hooks/use-user';

export async function loader({request, params, context}: LoaderFunctionArgs) {
  const {username} = params;

  if (!username) {
    throw new Response('username handler not defined', {
      status: 404,
    });
  }

  const {searchParams} = new URL(request.url);
  const type = searchParams.get('type');

  const collection = context.storefront.query(GET_USER_PRODUCTS, {
    variables: {
      handle: username,
      filters: [
        {tag: 'treatments'},
        {
          productMetafield: {
            namespace: 'booking',
            key: 'hide_from_profile',
            value: 'false',
          },
        },
        ...(type ? [{productType: type}] : []),
      ],
      country: context.storefront.i18n.country,
      language: context.storefront.i18n.language,
    },
    cache: context.storefront.CacheShort(),
  });

  return defer({
    collection,
  });
}

export default function ArtistIndex() {
  const data = useLoaderData<typeof loader>();
  const user = useUser();

  return (
    <Suspense fallback={<Skeleton height={8} radius="xl" />}>
      <Await resolve={data.collection}>
        {({collection}) => {
          const productTypesFilter =
            collection?.products.filters.find(
              (filter) => filter.label === 'Produkttype',
            )?.values || [];

          const productTypes = productTypesFilter
            .filter((f) => f.count > 0)
            .map((f) => f.label);

          return (
            <Flex direction="column" gap={{base: 'md', sm: 'xl'}}>
              {collection ? (
                <ArtistSchedulesMenu labels={productTypes} />
              ) : null}
              <SimpleGrid cols={{base: 1, md: 2}} spacing="lg">
                {collection?.products.nodes.map((product) => (
                  <ArtistProduct key={product.id} product={product} />
                ))}
              </SimpleGrid>
              {user.aboutMe ? (
                <Stack gap="xs" mt="xl">
                  <Title size={rem(28)}>Om mig</Title>
                  <Text dangerouslySetInnerHTML={{__html: user.aboutMe}}></Text>
                </Stack>
              ) : null}
            </Flex>
          );
        }}
      </Await>
    </Suspense>
  );
}

function ArtistSchedulesMenu({labels}: {labels: string[]}) {
  const user = useUser();
  const [searchParams] = useSearchParams();

  const type = String(searchParams.get('type'));

  return (
    <Flex
      gap={{base: 'sm', sm: 'lg'}}
      justify="center"
      align="center"
      wrap="wrap"
    >
      <Button
        size="lg"
        radius="lg"
        variant={type === 'null' ? 'filled' : 'light'}
        color={type === 'null' ? 'black' : user.theme}
        component={Link}
        to="?"
        data-testid="schedule-button-all"
      >
        Alle
      </Button>
      {labels.map((label) => {
        return (
          <Button
            size="lg"
            key={label}
            radius="lg"
            variant={type.includes(label) ? 'filled' : 'light'}
            color={type.includes(label) ? 'black' : user.theme}
            component={Link}
            to={`?type=${label}`}
            data-testid={`schedule-button-${label.toLowerCase()}`}
          >
            {label}
          </Button>
        );
      })}
    </Flex>
  );
}
