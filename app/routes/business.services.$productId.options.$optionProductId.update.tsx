import {parseWithZod} from '@conform-to/zod';
import {type ActionFunctionArgs} from '@shopify/remix-oxygen';
import {getBookingShopifyApi} from '~/lib/api/bookingShopifyApi';
import {getCustomer} from '~/lib/get-customer';
import {customerProductOptionsUpdateBody} from '~/lib/zod/bookingShopifyApi';

const schema = customerProductOptionsUpdateBody;

export const action = async ({
  request,
  context,
  params,
}: ActionFunctionArgs) => {
  const customerId = await getCustomer({context});
  const formData = await request.formData();
  const submission = parseWithZod(formData, {schema});
  const {productId, optionProductId} = params;

  if (!productId || !optionProductId) {
    throw new Error('Missing productHandle param, check route filename');
  }

  if (submission.status !== 'success') {
    return submission.reply();
  }

  try {
    const response = await getBookingShopifyApi().customerProductOptionsUpdate(
      customerId,
      productId,
      optionProductId,
      submission.value,
    );

    return response;
  } catch (error) {
    return submission.reply();
  }
};
