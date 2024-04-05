import {Button, Title} from '@mantine/core';
import {useSearchParams} from '@remix-run/react';
import {IconCircleLetterX} from '@tabler/icons-react';
import {type Speciality} from '~/routes/($locale).api.users.filters';
import classes from './ProfessionButton.module.css';

export const SpecialityButton = ({
  speciality,
  reset,
}: {
  speciality: Speciality;
  reset?: boolean;
}) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const specialities = searchParams.getAll('speciality');
  const exists = specialities.includes(speciality.speciality);

  const onClick = () => {
    const params = new URLSearchParams(searchParams.toString());

    if (exists) {
      params.delete('speciality');
      specialities
        .filter((s) => s !== speciality.speciality)
        .forEach((s) => params.append('speciality', s));
    } else {
      params.append('speciality', speciality.speciality);
    }

    setSearchParams(params, {replace: true});
  };

  return (
    <Button
      variant="default"
      radius="xl"
      size="xs"
      className={classes.button}
      onClick={onClick}
      rightSection={exists ? <IconCircleLetterX /> : <></>}
    >
      <Title order={6} fw="normal" textWrap="pretty" ta="center">
        {speciality.translation}
      </Title>
    </Button>
  );
};
