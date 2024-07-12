import {Avatar, rem, Space, Title, UnstyledButton} from '@mantine/core';
import {Link, useSearchParams} from '@remix-run/react';
import {useMemo} from 'react';
import {useTranslation} from 'react-i18next';
import {modifyImageUrl} from '~/lib/image';
import classes from './ProfessionButton.module.css';

export const skills = {
  scar_treatment: 'Ar Behandling',
  tattoo_removal: 'Tatoveringsfjernelse',
  cosmetic_teeth_whitening: 'Kosmetisk Tandblegning',
  microblading: 'Microblading',
  permanent_makeup: 'Permanent Makeup',
  skin_care: 'Hudpleje',
  massage: 'Massage',
  waxing_hair_removal: 'Voks Hårfjerning',
  body_treatments: 'Kropsbehandlinger',
  facial_treatments: 'Ansigtsbehandlinger',
  eyebrow_shaping: 'Bryn Formning',
  eyelash_extensions: 'Vippe Extensions',
  manicure_pedicure: 'Manicure Pedicure',
  acrylic_nails: 'Akryl Negle',
  gel_nails: 'Gel Negle',
  nail_art: 'Negl Kunst',
  balayage_specialist: 'Balayage Specialist',
  keratin_treatments: 'Keratin Behandlinger',
  hair_extensions: 'Hår Extensions',
  hair_coloring: 'Hår Farvning',
  vintage_styles: 'Vintage Stilarter',
  ethereal_makeup: 'Etereal Makeup',
  stage_makeup: 'Scene Makeup',
  airbrush_makeup: 'Airbrush Makeup',
  celebrity_makeup: 'Kendis Makeup',
  editorial_makeup: 'Redaktionel Makeup',
  sfx_makeup: 'SFX Makeup',
  bridal_makeup: 'Bryllups Makeup',
};

export const professions: Record<string, string> = {
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

export const useProfessionAndSkills = () => {
  const {t} = useTranslation(['professions', 'skills']);
  const professionOptions = useMemo(() => {
    return Object.keys(professions)
      .filter((key) => key !== 'all')
      .map((key) => ({
        label: t(`professions:${key}` as any),
        value: key,
      }));
  }, [t]);

  const skillsOptions = useMemo(() => {
    return Object.keys(skills).map((key) => ({
      label: t(`skills:${key}` as any),
      value: key,
    }));
  }, [t]);

  return {professionOptions, skillsOptions};
};

export const ProfessionButton = ({
  profession,
  reset,
}: {
  profession: string;
  reset?: boolean;
}) => {
  const [searchParams] = useSearchParams();
  const {t} = useTranslation(['professions']);

  const professionSearchParams = searchParams.get('profession') || '';

  return (
    <UnstyledButton
      className={classes.button}
      component={Link}
      to={reset ? '/users' : `/users?profession=${profession}`}
      data-checked={
        professionSearchParams === profession ||
        (reset && !professionSearchParams)
      }
    >
      <Avatar
        src={modifyImageUrl(professions[profession], '200x200')}
        alt={t(`professions:${profession}` as any)}
        radius="100%"
        size={rem(90)}
      />
      <Space h="xs" />
      <Title
        order={6}
        fw="normal"
        textWrap="pretty"
        ta="center"
        fz={{base: 'xs', sm: 'md'}}
      >
        {t(`professions:${profession}` as any)}
      </Title>
    </UnstyledButton>
  );
};
