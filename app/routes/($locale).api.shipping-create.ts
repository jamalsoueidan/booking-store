import {parseWithZod} from '@conform-to/zod';
import {json, type ActionFunctionArgs} from '@shopify/remix-oxygen';
import {getBookingShopifyApi} from '~/lib/api/bookingShopifyApi';
import {shippingCreateBody} from '~/lib/zod/bookingShopifyApi';

const schema = shippingCreateBody;

export const action = async ({request}: ActionFunctionArgs) => {
  const formData = await request.formData();
  const submission = parseWithZod(formData, {
    schema,
  });

  if (submission.status !== 'success') {
    return submission.reply();
  }
  try {
    const response = await getBookingShopifyApi().shippingCreate(
      submission.value,
    );

    return json(response.payload);
  } catch (error) {
    return submission.reply();
  }
};
