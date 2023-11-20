import {parse} from '@conform-to/zod';
import {json, type ActionFunctionArgs} from '@shopify/remix-oxygen';
import {getBookingShopifyApi} from '~/lib/api/bookingShopifyApi';
import {shippingCreateBody} from '~/lib/zod/bookingShopifyApi';

const schema = shippingCreateBody;

export const action = async ({request}: ActionFunctionArgs) => {
  const formData = await request.formData();
  const submission = parse(formData, {
    schema,
  });

  if (submission.intent !== 'submit' || !submission.value) {
    return json(submission);
  }
  try {
    const response = await getBookingShopifyApi().shippingCreate(
      submission.value,
    );

    return json(response.payload);
  } catch (error) {
    return json(submission);
  }
};
