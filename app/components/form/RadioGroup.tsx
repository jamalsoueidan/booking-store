import {useInputControl, type FieldMetadata} from '@conform-to/react';
import {Radio} from '@mantine/core';
import {useEffect} from 'react';

export type RadioGroupProps = {
  label: string;
  field: FieldMetadata<string> | FieldMetadata<number>;
  data: Array<{label: string; value: string}>;
};

export function RadioGroup({label, data, field}: RadioGroupProps) {
  const control = useInputControl(field);

  useEffect(() => {
    const findInData = data.findIndex((d) => d.value === field.initialValue);
    if (field.initialValue === '' && findInData === -1) {
      control.change(data[0].value);
    }
  }, [control, data, field.initialValue]);

  return (
    <>
      <Radio.Group
        label={label}
        defaultValue={field.initialValue}
        value={field.value}
        onChange={(value: string) => {
          control.change(value);
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
