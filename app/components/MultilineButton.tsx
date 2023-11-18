import {Button, Group, type ButtonProps} from '@mantine/core';
import classes from './MultilineButton.module.css';

export function MultilineButton(
  props: React.ComponentPropsWithoutRef<'button'> & ButtonProps,
) {
  return (
    <Button className={classes.button} {...props}>
      <Group gap="2" align="center" justify="center" p="0">
        {props.children}
      </Group>
    </Button>
  );
}
