import {Button, Title} from '@mantine/core';
import {useSearchParams} from '@remix-run/react';
import {type Speciality} from '~/routes/($locale).api.users.specialties';
import classes from './ProfessionButton.module.css';

export const SpecialityButton = ({
  speciality,
  reset,
}: {
  speciality: Speciality;
  reset?: boolean;
}) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const onClick = () => {
    const params = new URLSearchParams(searchParams.toString());
    const specialities = params.getAll('speciality');
    const exists = specialities.includes(speciality.key);

    if (exists) {
      params.delete('speciality');
      specialities
        .filter((s) => s !== speciality.key)
        .forEach((s) => params.append('speciality', s));
    } else {
      params.append('speciality', speciality.key);
    }

    setSearchParams(params, {replace: true});
  };

  return (
    <Button
      variant="default"
      radius="xl"
      size="sm"
      className={classes.button}
      onClick={onClick}
    >
      <Title order={6} fw="normal" textWrap="pretty" ta="center">
        {speciality.translation}
      </Title>
    </Button>
  );
};
