import {Checkbox, Radio, UnstyledButton} from '@mantine/core';
import {useUncontrolled} from '@mantine/hooks';
import classes from './ButtonCard.module.css';

interface ButtonCardProps {
  checked?: boolean;
  value: string;
  defaultChecked?: boolean;
  onChange?(checked: boolean): void;
  withCheckbox?: boolean;
  hidden?: boolean;
  corner?: boolean;
  withRadio?: boolean;
  name: string;
}

export function ButtonCard({
  checked,
  defaultChecked,
  value,
  onChange,
  className,
  children,
  withCheckbox,
  hidden,
  corner,
  withRadio,
  name,
  ...others
}: ButtonCardProps &
  Omit<React.ComponentPropsWithoutRef<'button'>, keyof ButtonCardProps>) {
  const [isChecked, handleChange] = useUncontrolled({
    value: checked,
    defaultValue: defaultChecked,
    finalValue: false,
    onChange,
  });

  const style: React.CSSProperties = {
    ...(hidden && {display: 'none'}),
    ...(corner && {
      position: 'absolute',
      right: 'var(--mantine-spacing-lg)',
      top: ' var(--mantine-spacing-lg)',
    }),
  };

  return (
    <UnstyledButton
      {...others}
      onClick={() => handleChange(!isChecked)}
      data-checked={isChecked || undefined}
      className={classes.button}
    >
      <div className={classes.body}>{children}</div>

      <span style={style}>
        {withCheckbox ? (
          <Checkbox
            checked={isChecked}
            name={name}
            value={value}
            onChange={() => {}}
            tabIndex={-1}
            styles={{
              input: {cursor: 'pointer'},
            }}
          />
        ) : null}

        {withRadio ? (
          <Radio
            checked={isChecked}
            name={name}
            value={value}
            onChange={() => {}}
            tabIndex={-1}
          />
        ) : null}
      </span>
    </UnstyledButton>
  );
}
