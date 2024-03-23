import {json, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {getBookingShopifyApi} from '~/lib/api/bookingShopifyApi';

export type Speciality = {
  key: string;
  translation: string;
  count: number;
};

export async function loader({request, context}: LoaderFunctionArgs) {
  const {searchParams} = new URL(request.url);
  const profession = String(searchParams.get('profession'));

  const {payload: specialties} = await getBookingShopifyApi().usersSpecialties({
    profession,
  });

  const translations: Record<string, string> = {
    massage_therapist: 'Massageterapeut',
    celebrity_makeup: 'Celebrity makeup',
    editorial_makeup: 'Editorial makeup',
    custom: 'Tilpasset',
    sfx_makeup: 'SFX makeup',
  };

  const translatedSpecialties = Object.keys(specialties)
    .map(
      (key) =>
        ({
          key,
          translation: translations[key] || key,
          count: specialties[key],
        } as Speciality),
    )
    .sort((a, b) => a?.translation?.localeCompare(b?.translation));

  return json(translatedSpecialties);
}
