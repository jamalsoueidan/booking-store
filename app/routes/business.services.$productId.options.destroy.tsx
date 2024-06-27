import {type ShouldRevalidateFunction} from '@remix-run/react';
import {type ActionFunctionArgs} from '@remix-run/server-runtime';
import {getBookingShopifyApi} from '~/lib/api/bookingShopifyApi';
import {getCustomer} from '~/lib/get-customer';

export const shouldRevalidate: ShouldRevalidateFunction = () => {
  return false;
};

export const action = async ({
  request,
  context,
  params,
}: ActionFunctionArgs) => {
  const customerId = await getCustomer({context});
  const formData = await request.formData();
  const {productId} = params;
  const optionProductId = String(formData.get('optionProductId'));

  if (!productId) {
    throw new Error('Missing productHandle param, check route filename');
  }

  const {payload: response} =
    await getBookingShopifyApi().customerProductOptionsDestroy(
      customerId,
      productId,
      optionProductId,
    );

  return response;
};
