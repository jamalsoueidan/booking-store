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
    acrylic_nails: 'Akrylnegle',
    airbrush_makeup: 'Airbrush makeup',
    balayage_specialist: 'Balayage specialist',
    body_treatments: 'Kropsbehandlinger',
    bridal_makeup: 'Brudemakeup',
    celebrity_makeup: 'Celebrity makeup',
    cosmetic_teeth_whitening: 'Kosmetisk tandblegning',
    custom: 'Tilpasset',
    editorial_makeup: 'Editorial makeup',
    ethereal_makeup: 'Eterisk makeup',
    eyebrow_shaping: 'Brynformning',
    eyelash_extensions: 'Vippeextensions',
    facial_treatments: 'Ansigtsbehandlinger',
    gel_nails: 'Gelnegle',
    hair_coloring: 'Hårfarvning',
    hair_extensions: 'Hårextensions',
    keratin_treatments: 'Keratinbehandlinger',
    manicure_pedicure: 'Manicure og pedicure',
    massage: 'Massage',
    massage_therapist: 'Massageterapeut',
    microblading: 'Microblading',
    nail_art: 'Neglekunst',
    permanent_makeup: 'Permanent makeup',
    scar_treatment: 'Arbehandling',
    sfx_makeup: 'SFX makeup',
    skin_care: 'Hudpleje',
    stage_makeup: 'Scenemakeup',
    tattoo_removal: 'Tatoveringsfjernelse',
    vintage_styles: 'Vintage stilarter',
    waxing_hair_removal: 'Voksning',
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
