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
    <div>
      <Button
        loading={isSubmitting}
        type="submit"
        data-testid="submit-button"
        {...props}
      >
        {children}
      </Button>
    </div>
  );
};
