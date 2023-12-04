import {parse} from '@conform-to/zod';
import {json, type ActionFunctionArgs} from '@shopify/remix-oxygen';
import {getBookingShopifyApi} from '~/lib/api/bookingShopifyApi';
import {shippingCalculateBody} from '~/lib/zod/bookingShopifyApi';

const schema = shippingCalculateBody;

export const action = async ({request}: ActionFunctionArgs) => {
  const formData = await request.formData();
  const submission = parse(formData, {
    schema,
  });

  if (submission.intent !== 'submit' || !submission.value) {
    return json(submission);
  }

  try {
    const response = await getBookingShopifyApi().shippingCalculate(
      submission.value,
    );

    return json(response.payload);
  } catch (error) {
    return json(submission);
  }
};
