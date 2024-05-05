import {type ActionFunctionArgs} from '@shopify/remix-oxygen';
import {getCustomer} from '~/lib/get-customer';

import {getBookingShopifyApi} from '~/lib/api/bookingShopifyApi';

export const action = async ({
  request,
  context,
  params,
}: ActionFunctionArgs) => {
  const customerId = await getCustomer({context});
  const formData = await request.formData();
  const {productId} = params;

  if (!productId) {
    throw new Error('Missing productHandle param, check route filename');
  }

  const optionProductId = String(formData.get('optionProductId'));
  const title = String(formData.get('title'));
  const productTitle = String(formData.get('productTitle'));

  const {payload: response} =
    await getBookingShopifyApi().customerProductOptionsAdd(
      customerId,
      productId,
      {
        cloneId: optionProductId,
        title: `${title} - (${productTitle})`,
      },
    );

  return response;
};
