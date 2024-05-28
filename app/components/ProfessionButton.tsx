import {Avatar, rem, Space, Title, UnstyledButton} from '@mantine/core';
import {Link, useSearchParams} from '@remix-run/react';
import {modifyImageUrl} from '~/lib/image';
import {
  ProfessionTranslations,
  ProfessionURL,
} from '~/routes/api.users.professions';
import classes from './ProfessionButton.module.css';

export const ProfessionButton = ({
  profession,
  reset,
}: {
  profession: string;
  reset?: boolean;
}) => {
  const [searchParams] = useSearchParams();

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
        alt={ProfessionTranslations[profession]}
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
        {ProfessionTranslations[profession]}
      </Title>
    </UnstyledButton>
  );
};
