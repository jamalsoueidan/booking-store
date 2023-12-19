import {Button} from '@mantine/core';
import {Link} from '@remix-run/react';
import type {MouseEvent, ReactNode} from 'react';

interface AccountButtonPropsWithTo {
  to: string;
  children: ReactNode;
  onClick?: never;
}

interface AccountButtonPropsWithOnClick {
  to?: never;
  onClick: (event: MouseEvent<HTMLButtonElement>) => void;
  children: ReactNode;
}

type AccountButtonProps =
  | AccountButtonPropsWithTo
  | AccountButtonPropsWithOnClick;

export function AccountButton(props: AccountButtonProps) {
  const {to, onClick, children} = props;

  if (to) {
    return (
      <Button
        component={Link}
        to={to}
        color="gray"
        radius="xl"
        size="compact-sm"
      >
        {children}
      </Button>
    );
  } else if (onClick) {
    return (
      <Button onClick={onClick} color="gray" radius="xl" size="compact-sm">
        {children}
      </Button>
    );
  } else {
    return null;
  }
}
