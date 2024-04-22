import {Button, type ButtonProps} from '@mantine/core';
import {NavLink} from '@remix-run/react';
import classes from './AccountButton.module.css';

export function AccountButton({
  children,
  to,
  ...props
}: ButtonProps & {to: string}) {
  return (
    <NavLink to={to} prefetch="intent" end>
      {({isActive}) => (
        <Button
          variant="outline"
          radius="xl"
          color="black"
          fw={!isActive ? '300' : 'bolder'}
          size="sm"
          classNames={classes}
        >
          {children}
        </Button>
      )}
    </NavLink>
  );
}
