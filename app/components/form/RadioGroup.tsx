import {useInputControl, type FieldMetadata} from '@conform-to/react';
import {Radio} from '@mantine/core';
import {useMemo} from 'react';

export type RadioGroupProps = {
  label: string;
  field: FieldMetadata<string> | FieldMetadata<number>;
  data: Array<{label: string; value: string}>;
};

export function RadioGroup({data, field, ...props}: RadioGroupProps) {
  const initialValue = useMemo(() => {
    const findInData = data.findIndex((d) => d.value === field.initialValue);
    if (findInData === -1) {
      return data[0].value;
    }
    return field.initialValue;
  }, [data, field.initialValue]);

  const control = useInputControl(field);

  return (
    <>
      <Radio.Group
        defaultValue={initialValue}
        onChange={control.change}
        {...props}
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
