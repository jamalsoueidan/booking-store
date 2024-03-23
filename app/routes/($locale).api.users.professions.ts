import {json, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {getBookingShopifyApi} from '~/lib/api/bookingShopifyApi';

export type Profession = {
  key: string;
  translation: string;
  count: number;
};

export const ProfessionTranslations: Record<string, string> = {
  nail_technician: 'Negletekniker',
  esthetician: 'Kosmetolog',
  hair_stylist: 'Frisør',
  makeup_artist: 'Makeupartist',
  massage_therapist: 'Massageterapeut',
  lash_technician: 'Vippetekniker',
  brow_technician: 'Bryntekniker',
};

export const ProfessionSentenceTranslations: Record<string, string> = {
  nail_technician: 'Få det perfekte neglelook med en top negletekniker.',
  esthetician: 'Fremhæv din naturlige skønhed med en ekspert i hudpleje.',
  hair_stylist: 'Transformér dit look med en førende frisør.',
  makeup_artist:
    'Perfektionér dit look for enhver lejlighed med en professionel makeupartist.',
  massage_therapist: 'Slap af og genoplad med en erfaren massageterapeut.',
  lash_technician: 'Få smukke og fyldige vipper med en erfaren vippetekniker.',
  brow_technician: 'Opnå de perfekte bryn med en professionel bryntekniker.',
};

export async function loader({request, context}: LoaderFunctionArgs) {
  const {payload: professions} =
    await getBookingShopifyApi().usersProfessions();

  const translatedProfessions = Object.keys(professions)
    .map(
      (key) =>
        ({
          key,
          translation: ProfessionTranslations[key] || key,
          count: professions[key],
        } as Profession),
    )
    .sort((a, b) => a?.translation?.localeCompare(b.translation));

  return json(translatedProfessions);
}
