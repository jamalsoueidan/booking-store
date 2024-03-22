import {Avatar, Space, Title, UnstyledButton} from '@mantine/core';
import {Link} from '@remix-run/react';
import {type Profession} from '~/routes/($locale).api.professions';
import classes from './ProfessionButton.module.css';

export const ProfessionButton = ({profession}: {profession: Profession}) => {
  console.log('test');
  return (
    <UnstyledButton
      className={classes.button}
      component={Link}
      to={`/artist/`}
      data-checked="true"
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
