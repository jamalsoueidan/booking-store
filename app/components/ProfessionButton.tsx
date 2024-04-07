import {Avatar, Space, Title, UnstyledButton} from '@mantine/core';
import {useNavigate, useSearchParams} from '@remix-run/react';
import {type Profession} from '~/routes/($locale).api.users.professions';
import classes from './ProfessionButton.module.css';

export const ProfessionButton = ({
  profession,
  reset,
}: {
  profession: Profession;
  reset?: boolean;
}) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate(); // Get the navigate function

  const professionSearchParams = searchParams.get('profession') || '';

  const navigateTo = () => {
    if (reset) {
      navigate(`/artists`);
    } else {
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.set('profession', profession.profession);
      navigate(`search?${newSearchParams.toString()}`);
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
      <Avatar
        src={`${
          profession.profession
            ? `/professions/${profession.profession}.webp`
            : `https://placehold.co/400x600?text=${profession.translation}`
        }`}
        alt={profession.translation}
        radius="xl"
        size="xl"
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
