import {json, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {getBookingShopifyApi} from '~/lib/api/bookingShopifyApi';

export type Speciality = {
  speciality: string;
  translation: string;
  count: number;
};

const translationsSpecialties: Record<string, string> = {
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

export const translationsDays: Record<string, string> = {
  monday: 'Mandag',
  tuesday: 'Tirsdag',
  wednesday: 'Onsdag',
  thursday: 'Torsdag',
  friday: 'Fredag',
  saturday: 'Lørdag',
  sunday: 'Søndag',
};

export type AvailableDays = {
  day: string;
  translation: string;
  count: number;
};

export async function loader({params}: LoaderFunctionArgs) {
  const {handle} = params;

  const {payload} = await getBookingShopifyApi().usersFilters({
    profession: handle,
  });

  const specialties = payload.specialties
    ?.map(
      ({count, speciality}) =>
        ({
          speciality,
          count,
          translation: translationsSpecialties[speciality || ''],
        } as Speciality),
    )
    .sort((a, b) => a?.translation?.localeCompare(b?.translation));

  const daysOrder = Object.keys(translationsDays);
  const availableDays = payload.availableDays
    ?.map(
      ({day, count}) =>
        ({
          day,
          translation: translationsDays[day || ''],
          count,
        } as AvailableDays),
    )
    .sort((a, b) => {
      return (
        daysOrder.indexOf(a.day.toLowerCase()) -
        daysOrder.indexOf(b.day.toLowerCase())
      );
    });

  const locations = payload.locations.sort((a, b) =>
    a?.city?.localeCompare(b?.city),
  );

  return json({specialties, availableDays, locations});
}
