import {Avatar, rem, Space, Title, UnstyledButton} from '@mantine/core';
import {useMediaQuery} from '@mantine/hooks';
import {useNavigate, useSearchParams} from '@remix-run/react';
import {modifyImageUrl} from '~/lib/image';
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
      <Avatar
        src={modifyImageUrl(profession.url, '200x200')}
        alt={profession.translation}
        radius="100%"
        size={isMobile ? 'lg' : rem(100)}
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
