import {json, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {getBookingShopifyApi} from '~/lib/api/bookingShopifyApi';

export type Profession = {
  profession: string;
  translation: string;
  url: string;
  count: number;
};

export const ProfessionURL: Record<string, string> = {
  all: 'https://cdn.shopify.com/s/files/1/0682/4060/5458/files/all.jpg?v=1713361903',
  nail_technician:
    'https://cdn.shopify.com/s/files/1/0682/4060/5458/files/nail_technician.webp?v=1713361477',
  esthetician:
    'https://cdn.shopify.com/s/files/1/0682/4060/5458/files/esthetician.jpg?v=1713361568',
  hair_stylist:
    'https://cdn.shopify.com/s/files/1/0682/4060/5458/files/hair_stylist.jpg?v=1713361484',
  makeup_artist:
    'https://cdn.shopify.com/s/files/1/0682/4060/5458/files/makeup-artist.jpg?v=1713361442',
  massage_therapist:
    'https://cdn.shopify.com/s/files/1/0682/4060/5458/files/massage_therapist.jpg?v=1713361452',
  lash_technician:
    'https://cdn.shopify.com/s/files/1/0682/4060/5458/files/lash_technician.jpg?v=1713361470',
  brow_technician:
    'https://cdn.shopify.com/s/files/1/0682/4060/5458/files/brow_technician.jpg?v=1713361576',
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
  nail_technician: 'Få det perfekte neglelook med en top [negletekniker]',
  esthetician: 'Fremhæv din naturlige skønhed med en ekspert [kosmetolog]',
  hair_stylist: 'Transformér dit look med en førende [frisør]',
  makeup_artist: 'Perfektionér dit look med en [makeupartist]',
  massage_therapist: 'Slap af og genoplad med en [massageterapeut]',
  lash_technician: 'Få smukke og fyldige vipper med en erfaren [vippetekniker]',
  brow_technician: 'Opnå de perfekte bryn med en [bryntekniker]',
};

export async function loader({request, context}: LoaderFunctionArgs) {
  const {payload: professions} =
    await getBookingShopifyApi().usersProfessions();

  const translatedProfessions = professions
    .map(
      ({profession, count}) =>
        ({
          profession,
          translation: ProfessionTranslations[profession || ''],
          url: ProfessionURL[profession || ''],
          count,
        } as Profession),
    )
    .sort((a, b) => a?.translation?.localeCompare(b.translation));

  return json(translatedProfessions);
}
