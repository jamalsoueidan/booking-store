import {Checkbox, UnstyledButton} from '@mantine/core';
import {useUncontrolled} from '@mantine/hooks';
import classes from './ArtistServiceCheckboxCard.module.css';

interface ArtistServiceCheckboxCardProps {
  checked?: boolean;
  value: string;
  defaultChecked?: boolean;
  onChange?(checked: boolean): void;
  name: string;
}

export function ArtistServiceCheckboxCard({
  checked,
  defaultChecked,
  value,
  onChange,
  className,
  children,
  name,
  ...others
}: ArtistServiceCheckboxCardProps &
  Omit<
    React.ComponentPropsWithoutRef<'button'>,
    keyof ArtistServiceCheckboxCardProps
  >) {
  const [isChecked, handleChange] = useUncontrolled({
    value: checked,
    defaultValue: defaultChecked,
    finalValue: false,
    onChange,
  });

  const style: React.CSSProperties = {
    position: 'absolute',
    right: 'var(--mantine-spacing-sm)',
    top: ' var(--mantine-spacing-sm)',
  };

  return (
    <UnstyledButton
      {...others}
      onClick={() => handleChange(!isChecked)}
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
