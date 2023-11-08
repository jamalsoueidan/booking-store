import {Button, Card, Divider, Grid, Group, Text, Title} from '@mantine/core';
import {Link, useLoaderData} from '@remix-run/react';
import {Money, parseGid} from '@shopify/hydrogen';
import {type ProductConnection} from '@shopify/hydrogen/storefront-api-types';
import {json, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {PRODUCT_SIMPLE} from '~/data/fragments';
import {getBookingShopifyApi} from '~/lib/api/bookingShopifyApi';
import {getCustomer} from '~/lib/get-customer';

export async function loader({context}: LoaderFunctionArgs) {
  const {storefront} = context;
  const customer = await getCustomer({context});
  const response = await getBookingShopifyApi().customerProductsList(
    customer.id,
  );

  const productIds = response.payload.map(({productId}) => productId);

  const data = await context.storefront.query<{
    products: ProductConnection;
  }>(ALL_PRODUCTS_QUERY, {
    variables: {
      first: productIds.length,
      query: productIds.length > 0 ? productIds.join(' OR ') : 'id=-',
      country: storefront.i18n.country,
      language: storefront.i18n.language,
    },
  });

  return json({
    storeProducts: data.products,
    customerProducts: response.payload,
  });
}

export default function AccountServicesIndex() {
  const {storeProducts, customerProducts} = useLoaderData<typeof loader>();

  return (
    <>
      <Title>Lokationer</Title>
      <Group mt="md">
        <Button component={Link} to={'create'} radius="xl" size="md">
          Tilføj ydelse
        </Button>
      </Group>
      <Divider my="md" />

      <Grid align="stretch">
        {storeProducts.nodes.map((product) => {
          const customerProduct = customerProducts.find(({productId}) => {
            return productId.toString() === parseGid(product.id).id;
          });

          const variant = product.variants.nodes.find(({id}) => {
            return parseGid(id).id === customerProduct?.variantId.toString();
          });
          return (
            <Grid.Col key={product.id} span={{base: 12, md: 6, lg: 4}}>
              <Card padding="sm" radius="md" h="100%" withBorder>
                <Title order={4}>{product.title}</Title>

                <Text>{customerProduct?.scheduleName}</Text>

                <Money withoutTrailingZeros data={variant!.price} as="span" />

                <Button component={Link} to={`${parseGid(product.id)}`}>
                  Rediger
                </Button>
              </Card>
            </Grid.Col>
          );
        })}
      </Grid>
    </>
  );
}

const ALL_PRODUCTS_QUERY = `#graphql
  ${PRODUCT_SIMPLE}
  query AccountServicesProducts(
    $country: CountryCode
    $language: LanguageCode
    $first: Int
    $query: String
  ) @inContext(country: $country, language: $language) {
    products(first: $first, query: $query) {
      nodes {
        ...ProductSimple
      }
    }
  }
`;
