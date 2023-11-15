import {Checkbox, Radio, UnstyledButton} from '@mantine/core';
import {useUncontrolled} from '@mantine/hooks';
import classes from './ButtonCard.module.css';

interface ButtonCardProps {
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?(checked: boolean): void;
  withCheckbox?: boolean;
  withRadio?: boolean;
}

export function ButtonCard({
  checked,
  defaultChecked,
  onChange,
  className,
  children,
  withCheckbox,
  withRadio,
  ...others
}: ButtonCardProps &
  Omit<React.ComponentPropsWithoutRef<'button'>, keyof ButtonCardProps>) {
  const [value, handleChange] = useUncontrolled({
    value: checked,
    defaultValue: defaultChecked,
    finalValue: false,
    onChange,
  });

  return (
    <UnstyledButton
      {...others}
      onClick={() => handleChange(!value)}
      data-checked={value || undefined}
      className={classes.button}
    >
      <div className={classes.body}>{children}</div>

      {withCheckbox ? (
        <Checkbox
          checked={value}
          name="locationId"
          id="locationId"
          onChange={() => {}}
          tabIndex={-1}
          styles={{input: {cursor: 'pointer'}}}
        />
      ) : null}

      {withRadio ? (
        <Radio
          checked={value}
          name="locationId"
          id="locationId"
          onChange={() => {}}
          tabIndex={-1}
        />
      ) : null}
    </UnstyledButton>
  );
}
