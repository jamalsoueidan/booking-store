import {Avatar, Space, Title, UnstyledButton} from '@mantine/core';
import {Link, useSearchParams} from '@remix-run/react';
import {type Profession} from '~/routes/($locale).api.users.professions';
import classes from './ProfessionButton.module.css';

export const ProfessionButton = ({
  profession,
  reset,
}: {
  profession: Profession;
  reset?: boolean;
}) => {
  const [params] = useSearchParams();
  const professionParams = params.get('profession');

  return (
    <UnstyledButton
      className={classes.button}
      component={Link}
      to={reset ? '/artists' : `/artists?profession=${profession.key}`}
      data-checked={
        professionParams === profession.key || (reset && !professionParams)
      }
    >
      <Avatar
        src={`/professions/${profession.key}.webp`}
        alt={profession.translation}
        radius="xl"
        size="xl"
      />
      <Space h="xs" />
      <Title order={6} fw="normal" textWrap="pretty" ta="center">
        {profession.translation}
      </Title>
    </UnstyledButton>
  );
};
