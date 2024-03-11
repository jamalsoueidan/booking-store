import {Button, type ButtonProps} from '@mantine/core';
import {Link} from '@remix-run/react';
import type {MouseEvent, ReactNode} from 'react';
import classes from './AccountButton.module.css';

type AccountButtonPropsWithTo = {
  to: string;
  children: ReactNode;
  onClick?: never;
};

type AccountButtonPropsWithOnClick = {
  to?: never;
  onClick: (event: MouseEvent<HTMLButtonElement>) => void;
  children: ReactNode;
};

type AccountButtonProps =
  | AccountButtonPropsWithTo
  | AccountButtonPropsWithOnClick;

export function AccountButton(props: AccountButtonProps & ButtonProps) {
  const {to, onClick, children, ...rest} = props;

  if (to) {
    return (
      <Button
        component={Link}
        to={to}
        color="gray"
        radius="xl"
        size="compact-sm"
        classNames={classes}
        {...rest}
      >
        {children}
      </Button>
    );
  } else if (onClick) {
    return (
      <Button
        onClick={onClick}
        color="gray"
        radius="xl"
        size="compact-sm"
        classNames={classes}
        {...rest}
      >
        {children}
      </Button>
    );
  } else {
    return null;
  }
}
