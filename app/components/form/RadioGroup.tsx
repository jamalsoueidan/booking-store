import {type FieldMetadata} from '@conform-to/react';
import {Radio} from '@mantine/core';
import {useMemo} from 'react';

export type RadioGroupProps = {
  label: string;
  field: FieldMetadata<string> | FieldMetadata<number>;
  data: Array<{label: string; value: string}>;
};

export function RadioGroup({label, data, field}: RadioGroupProps) {
  const initialValue = useMemo(() => {
    const findInData = data.findIndex((d) => d.value === field.initialValue);
    if (findInData === -1) {
      return data[0].value;
    }
    return field.initialValue;
  }, [data, field.initialValue]);

  return (
    <>
      <Radio.Group
        label={label}
        defaultValue={initialValue}
        value={field.value}
        name={field.name}
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
