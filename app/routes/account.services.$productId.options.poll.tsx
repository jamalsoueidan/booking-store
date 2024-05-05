import {json, type LoaderFunctionArgs} from '@remix-run/server-runtime';

import {PRODUCT_TAG_OPTIONS_QUERY} from '~/graphql/storefront/ProductTagOptions';
import {getCustomer} from '~/lib/get-customer';

export async function loader({context}: LoaderFunctionArgs) {
  const customerId = await getCustomer({context});

  const {products: options} = await context.storefront.query(
    PRODUCT_TAG_OPTIONS_QUERY,
    {
      variables: {
        query: `tag:user AND tag:customer-${customerId} AND NOT id:${Math.ceil(
          Math.random() * 1000,
        )}`,
      },
      cache: context.storefront.CacheNone(),
    },
  );

  return json(options.nodes.length);
}
