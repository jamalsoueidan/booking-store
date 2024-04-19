import {Button, type ButtonProps} from '@mantine/core';
import {Link} from '@remix-run/react';
import classes from './AccountButton.module.css';

export function AccountButton({
  children,
  ...props
}: ButtonProps & {to: string}) {
  return (
    <Button
      color="gray"
      radius="xl"
      size="compact-sm"
      component={Link}
      classNames={classes}
      {...props}
    >
      {children}
    </Button>
  );
}
