import {Button} from '@mantine/core';
import {useNavigation} from '@remix-run/react';
import {type PropsWithChildren} from 'react';

export const SubmitButton: React.FC<PropsWithChildren & any> = ({
  children,
  ...props
}) => {
  const navigation = useNavigation();
  const isSubmitting = navigation.state === 'submitting';

  return (
    <Button loading={isSubmitting} type="submit" {...props}>
      {children}
    </Button>
  );
};
