import {
  Checkbox,
  UnstyledButton,
  type UnstyledButtonProps,
} from '@mantine/core';
import classes from './ArtistServiceCheckboxCard.module.css';

export function ArtistServiceCheckboxCard({
  children,
  isChecked,
  ...props
}: UnstyledButtonProps &
  Omit<React.ComponentPropsWithoutRef<'button'>, keyof UnstyledButtonProps> & {
    isChecked: boolean;
  }) {
  return (
    <UnstyledButton
      {...props}
      data-checked={isChecked || undefined}
      className={classes.button}
    >
      <div className={classes.body}>{children}</div>

      <Checkbox
        checked={isChecked}
        tabIndex={-1}
        classNames={{root: classes.checkbox}}
        disabled
      />
    </UnstyledButton>
  );
}
