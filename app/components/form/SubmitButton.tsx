import {Button} from '@mantine/core';
import {useNavigation} from '@remix-run/react';
import {type PropsWithChildren} from 'react';

export const SubmitButton: React.FC<PropsWithChildren> = ({children}) => {
  const navigation = useNavigation();
  const isSubmitting = navigation.state === 'submitting';

  return (
    <Button loading={isSubmitting} type="submit">
      {children}
    </Button>
  );
};
