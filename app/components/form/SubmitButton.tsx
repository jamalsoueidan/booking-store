import {Button, type ButtonProps} from '@mantine/core';
import {useNavigation} from '@remix-run/react';
import {type PropsWithChildren} from 'react';

export const SubmitButton: React.FC<PropsWithChildren & ButtonProps> = ({
  children,
  ...props
}) => {
  const navigation = useNavigation();
  const isSubmitting = navigation.state === 'submitting';

  return (
    <Button
      loading={isSubmitting}
      type="submit"
      {...props}
      data-testid="submit-button"
    >
      {children}
    </Button>
  );
};
