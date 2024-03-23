import {json, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {getBookingShopifyApi} from '~/lib/api/bookingShopifyApi';

export type Profession = {
  key: string;
  translation: string;
  count: number;
};

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
  const translatedProfessions = Object.keys(professions)
    .map(
      (key) =>
        ({
          key,
          translation: translations[key] || key,
          count: professions[key],
        } as Profession),
    )
    .sort((a, b) => a?.translation?.localeCompare(b.translation));

  return json(translatedProfessions);
}
