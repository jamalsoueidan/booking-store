import {Image, Space, Title, UnstyledButton} from '@mantine/core';
import {useMediaQuery} from '@mantine/hooks';
import {useNavigate, useSearchParams} from '@remix-run/react';
import {type Profession} from '~/routes/api.users.professions';
import classes from './ProfessionButton.module.css';

export const ProfessionButton = ({
  profession,
  reset,
}: {
  profession: Profession;
  reset?: boolean;
}) => {
  const isMobile = useMediaQuery('(max-width: 62em)');
  const [searchParams] = useSearchParams();
  const navigate = useNavigate(); // Get the navigate function

  const professionSearchParams = searchParams.get('profession') || '';

  const navigateTo = () => {
    if (reset) {
      navigate(`/artists`);
    } else {
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.set('profession', profession.profession);
      navigate(`/artists/search?${newSearchParams.toString()}`);
    }
  };

  return (
    <UnstyledButton
      className={classes.button}
      onClick={navigateTo}
      data-checked={
        professionSearchParams === profession.profession ||
        (reset && !professionSearchParams)
      }
    >
      <Image
        src={`/professions/${profession.profession}.webp`}
        fallbackSrc={`https://placehold.co/120x120?text=${profession.translation}`}
        alt={profession.translation}
        radius="100%"
        w={isMobile ? '60px' : '100px'}
        h="auto"
      />
      <Space h="xs" />
      <Title
        order={6}
        fw="normal"
        textWrap="pretty"
        ta="center"
        fz={{base: 'xs', sm: 'md'}}
      >
        {profession.translation}
      </Title>
    </UnstyledButton>
  );
};
