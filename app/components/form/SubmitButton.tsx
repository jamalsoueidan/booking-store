import {Button, type ButtonProps} from '@mantine/core';
import {useNavigation} from '@remix-run/react';
import {useEffect, useRef, useState, type PropsWithChildren} from 'react';

export const SubmitButton: React.FC<PropsWithChildren & ButtonProps> = ({
  children,
  ...props
}) => {
  const navigation = useNavigation();
  const [action, setAction] = useState('');
  const buttonRef = useRef<HTMLButtonElement>(null);
  const isSubmitting =
    navigation.state !== 'idle' && action === navigation.location?.pathname;

  useEffect(() => {
    const form = buttonRef.current ? buttonRef.current.closest('form') : null;
    if (form) {
      const url = new URL(form.action);
      setAction(url.pathname);
    }
  }, []);

  return (
    <div>
      <Button
        ref={buttonRef}
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
