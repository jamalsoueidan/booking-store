import {json, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {getBookingShopifyApi} from '~/lib/api/bookingShopifyApi';

export async function loader({request, context}: LoaderFunctionArgs) {
  const {payload: professions} =
    await getBookingShopifyApi().usersProfessions();

  // Translation map for professions to Danish
  const translations: Record<string, string> = {
    nail_technician: 'Negletekniker',
    esthetician: 'Kosmetolog',
    hair_stylist: 'Frisør',
    makeup_artist: 'Makeupartist',
    massage_therapist: 'Massageterapeut',
  };

  // Transform professions into an array of objects with key, translation, and count
  const translatedProfessions = Object.keys(professions).map((key) => ({
    key,
    translation: translations[key],
    count: professions[key],
  }));

  return json(translatedProfessions);
}
