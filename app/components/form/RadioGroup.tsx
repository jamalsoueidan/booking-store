import {conform, useInputEvent, type FieldConfig} from '@conform-to/react';
import {Radio} from '@mantine/core';
import {useEffect, useRef, useState} from 'react';

export type RadioGroupProps = {
  onChange?: (value: string) => void;
  label: string;
  field: FieldConfig<string>;
  data: Array<{label: string; value: string}>;
};

export function RadioGroup({onChange, label, data, field}: RadioGroupProps) {
  const [value, setValue] = useState(field.defaultValue ?? '');

  const shadowInputRef = useRef<HTMLInputElement>(null);

  const control = useInputEvent({
    ref: shadowInputRef,
    onReset: () => setValue(field.defaultValue ?? ''),
  });

  useEffect(() => {
    if (field.defaultValue === '') {
      const id = setValue(data[0].value);
      control.change(data[0].value);
      if (onChange) {
        onChange(value);
      }
    }
  }, [control, data, field.defaultValue, onChange, value]);

  // https://conform.guide/checkbox-and-radio-group
  return (
    <>
      <input
        ref={shadowInputRef}
        {...conform.input(field, {hidden: true})}
        onChange={(e) => setValue(e.target.value)}
      />
      <Radio.Group
        label={label}
        value={value}
        onChange={(value: string) => {
          control.change(value);
          if (onChange) {
            onChange(value);
          }
        }}
      >
        {data.map((d) => (
          <Radio
            key={d.value}
            mt="xs"
            mb="xs"
            label={d.label}
            value={d.value}
          />
        ))}
      </Radio.Group>
    </>
  );
}
