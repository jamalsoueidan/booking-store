import {Checkbox, Radio, UnstyledButton} from '@mantine/core';
import {useUncontrolled} from '@mantine/hooks';
import classes from './ButtonCard.module.css';

interface ButtonCardProps {
  checked?: boolean;
  value: string;
  defaultChecked?: boolean;
  onChange?(checked: boolean): void;
  withCheckbox?: boolean;
  withRadio?: boolean;
}

export function ButtonCard({
  checked,
  defaultChecked,
  value,
  onChange,
  className,
  children,
  withCheckbox,
  withRadio,
  ...others
}: ButtonCardProps &
  Omit<React.ComponentPropsWithoutRef<'button'>, keyof ButtonCardProps>) {
  const [isChecked, handleChange] = useUncontrolled({
    value: checked,
    defaultValue: defaultChecked,
    finalValue: false,
    onChange,
  });

  return (
    <UnstyledButton
      {...others}
      onClick={() => handleChange(!isChecked)}
      data-checked={isChecked || undefined}
      className={classes.button}
    >
      <div className={classes.body}>{children}</div>

      {withCheckbox ? (
        <Checkbox
          checked={isChecked}
          name="locationId"
          value={value}
          onChange={() => {}}
          tabIndex={-1}
          styles={{input: {cursor: 'pointer'}}}
        />
      ) : null}

      {withRadio ? (
        <Radio
          checked={isChecked}
          name="locationId"
          value={value}
          onChange={() => {}}
          tabIndex={-1}
        />
      ) : null}
    </UnstyledButton>
  );
}
