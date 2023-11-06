import {Button} from '@mantine/core';
import {useIsSubmitting} from 'remix-validated-form';

export const SubmitButton = () => {
  const isSubmitting = useIsSubmitting();
  return (
    <Button type="submit" loading={isSubmitting}>
      Gem
    </Button>
  );
};
