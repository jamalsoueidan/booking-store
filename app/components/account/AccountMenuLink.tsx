import {NavLink, UnstyledButton} from '@mantine/core';
import {NavLink as RemixNavLink} from '@remix-run/react';
import type {Icon, IconProps} from '@tabler/icons-react';
import classes from './AccountMenuLink.module.css';

type Item = {
  link: string;
  label: string;
  icon: React.ForwardRefExoticComponent<
    Omit<IconProps, 'ref'> & React.RefAttributes<Icon>
  >;
  isBusiness: boolean;
  data: string;
  deactiveActive?: boolean;
};

export function AccountMenuLink({
  item,
  onClick,
}: {
  item: Item;
  onClick: (e: any) => void;
}) {
  return (
    <UnstyledButton component={RemixNavLink} to={item.link}>
      {({isActive}) => (
        // eslint-disable-next-line jsx-a11y/anchor-has-content
        <NavLink
          classNames={classes}
          active={isActive && !item.deactiveActive}
          onClick={onClick}
          label={item.label}
          data-testid={item.data}
          leftSection={<item.icon stroke={1.5} />}
        />
      )}
    </UnstyledButton>
  );
}
