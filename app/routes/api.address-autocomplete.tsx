import {conformZodMessage} from '@conform-to/zod';
import {json, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {z} from 'zod';
import {customerLocationCreateBody} from '~/lib/zod/bookingShopifyApi';

export interface ApiAutoCompleteProposal
  extends Record<string, object | string | number> {
  type: string;
  tekst: string;
  forslagstekst: string;
  caretpos: number;
}

export async function loader({request, context}: LoaderFunctionArgs) {
  // Get URLSearchParams object from request
  const url = new URL(request.url);
  const searchParams = url.searchParams;

  // Get 'q' parameter from URL
  const q = searchParams.get('q');

  let dawaData: any = {};
  if (q) {
    // Fetch from DAWA API if 'q' is not null
    const dawaResponse = await fetch(
      `https://dawa.aws.dk/autocomplete?q=${encodeURIComponent(
        q || '',
      )}&type=adresse&caretpos=8&supplerendebynavn=true&stormodtagerpostnumre=true&multilinje=true&fuzzy=`,
    );
    // handle the response as you need
    // for example, you can get the json data as following
    dawaData = await dawaResponse.json();
  }

  return json(dawaData);
}

export const validateAddress = async (address: string) => {
  const response = await fetch(
    `https://dawa.aws.dk/autocomplete?q=${encodeURIComponent(
      address,
    )}&type=adresse&caretpos=8&supplerendebynavn=true&stormodtagerpostnumre=true&multilinje=true&fuzzy=`,
  );
  const data: Array<ApiAutoCompleteProposal> = (await response.json()) as any;
  if (data.length === 1) {
    const first = data[0];
    return first.tekst === address;
  }
  return data.length === 1;
};

export function createValidateAddressSchema(options?: {
  customerLocationCreateBody: z.ZodObject<{fullAddress: z.ZodString}>;
  validateAddress?: (username: string) => Promise<boolean>;
}) {
  return customerLocationCreateBody.extend({
    fullAddress: customerLocationCreateBody.shape.fullAddress.pipe(
      z.string().superRefine((fullAddress, ctx) => {
        if (typeof options?.validateAddress !== 'function') {
          ctx.addIssue({
            code: 'custom',
            message: conformZodMessage.VALIDATION_UNDEFINED,
            fatal: true,
          });
          return;
        }

        return options.validateAddress(fullAddress).then((addressIsCorrect) => {
          if (!addressIsCorrect) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              params: {
                i18n: 'full_address.not_valid',
              },
            });
          }
        });
      }),
    ),
  });
}
