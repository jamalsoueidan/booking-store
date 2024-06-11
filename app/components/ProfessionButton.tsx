import {Avatar, rem, Space, Title, UnstyledButton} from '@mantine/core';
import {Link, useSearchParams} from '@remix-run/react';
import {modifyImageUrl} from '~/lib/image';
import {useTranslations} from '~/providers/Translation';
import classes from './ProfessionButton.module.css';

const ProfessionURL: Record<string, string> = {
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

export const ProfessionButton = ({
  profession,
  reset,
}: {
  profession: string;
  reset?: boolean;
}) => {
  const [searchParams] = useSearchParams();
  const {t} = useTranslations();

  const professionSearchParams = searchParams.get('profession') || '';

  return (
    <UnstyledButton
      className={classes.button}
      component={Link}
      to={reset ? '/artists' : `/artists?profession=${profession}`}
      data-checked={
        professionSearchParams === profession ||
        (reset && !professionSearchParams)
      }
    >
      <Avatar
        src={modifyImageUrl(ProfessionURL[profession], '200x200')}
        alt={t[`profession_${profession}`]}
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
        {t[`profession_${profession}`]}
      </Title>
    </UnstyledButton>
  );
};
