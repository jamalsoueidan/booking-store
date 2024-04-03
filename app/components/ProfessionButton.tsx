import {Avatar, Space, Title, UnstyledButton} from '@mantine/core';
import {Link, useParams} from '@remix-run/react';
import {type Profession} from '~/routes/($locale).api.users.professions';
import classes from './ProfessionButton.module.css';

export const ProfessionButton = ({
  profession,
  reset,
}: {
  profession: Profession;
  reset?: boolean;
}) => {
  const params = useParams();
  const {handle: professionParams} = params;

  return (
    <UnstyledButton
      className={classes.button}
      component={Link}
      to={reset ? '/artists' : `/artists/${profession.key}`}
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
