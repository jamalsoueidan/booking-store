import {
  Button,
  Card,
  Divider,
  Grid,
  Group,
  SimpleGrid,
  Text,
  Title,
} from '@mantine/core';
import {Form, Link, useLoaderData} from '@remix-run/react';
import {Money, parseGid} from '@shopify/hydrogen';
import {type ProductConnection} from '@shopify/hydrogen/storefront-api-types';
import {json, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {PRODUCT_ITEM_FRAGMENT} from '~/data/fragments';
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
      <Title>Ydelser</Title>
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

          return (
            <Grid.Col key={product.id} span={{base: 12, md: 6, lg: 4}}>
              <Card padding="sm" radius="md" h="100%" withBorder>
                <Title order={4}>{product.title}</Title>

                <Text>{customerProduct?.scheduleName}</Text>

                {customerProduct?.price && (
                  <Money
                    withoutTrailingZeros
                    data={customerProduct?.price as any}
                    as="span"
                  />
                )}

                <SimpleGrid cols={2} verticalSpacing="xs" mt="lg">
                  <Button component={Link} to={`${parseGid(product.id).id}`}>
                    Rediger
                  </Button>

                  <Form
                    method="post"
                    action={`${parseGid(product.id).id}/destroy`}
                    style={{display: 'inline-block'}}
                  >
                    <Button
                      variant="light"
                      color="blue"
                      fullWidth
                      size="xs"
                      type="submit"
                    >
                      Slet
                    </Button>
                  </Form>
                </SimpleGrid>
              </Card>
            </Grid.Col>
          );
        })}
      </Grid>
    </>
  );
}

const ALL_PRODUCTS_QUERY = `#graphql
  ${PRODUCT_ITEM_FRAGMENT}
  query AccountServicesProducts(
    $country: CountryCode
    $language: LanguageCode
    $first: Int
    $query: String
  ) @inContext(country: $country, language: $language) {
    products(first: $first, query: $query) {
      nodes {
        ...ProductItem
      }
    }
  }
`;
