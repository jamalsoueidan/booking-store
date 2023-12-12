import {json, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {PRODUCT_SELECTED_OPTIONS_QUERY_ID} from '~/data/queries';
import {getBookingShopifyApi} from '~/lib/api/bookingShopifyApi';
import {getCustomer} from '~/lib/get-customer';

export async function loader({params, request, context}: LoaderFunctionArgs) {
  const customer = await getCustomer({context});

  const lineItem = params.lineItem || '';
  const productId = params.productId || '';

  const url = new URL(request.url);
  const searchParams = new URLSearchParams(url.search);

  const locationId = searchParams.get('locationId') || '';
  const shippingId = searchParams.get('shippingId') || '';

  const {payload: customerProduct} =
    await getBookingShopifyApi().customerProductGet(customer.id, productId);

  const location = locationId
    ? await getBookingShopifyApi().customerLocationGet(customer.id, locationId)
    : null;

  const shipping = shippingId
    ? await getBookingShopifyApi().shippingGet(shippingId)
    : null;

  const {product} = await context.storefront.query(
    PRODUCT_SELECTED_OPTIONS_QUERY_ID,
    {
      variables: {
        Id: `gid://shopify/Product/${productId}`,
        selectedOptions: customerProduct.selectedOptions,
        country: context.storefront.i18n.country,
        language: context.storefront.i18n.language,
      },
    },
  );

  return json({
    product,
    location: location ? location.payload : null,
    shipping: shipping ? shipping.payload : null,
  });
}
