import {useInputControl, type FieldMetadata} from '@conform-to/react';
import {Group, Radio, Stack, Text} from '@mantine/core';
import {useMemo} from 'react';
import classes from './RadioGroup.module.css';

export type RadioGroupProps = {
  label: string;
  field: FieldMetadata<string> | FieldMetadata<number>;
  data: Array<{label: string; value: string; icon?: React.ReactNode}>;
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
    <Radio.Group
      size="md"
      defaultValue={initialValue}
      onChange={control.change}
      {...props}
    >
      <Stack gap="xs" mt="xs">
        {data.map((item) => (
          <Radio.Card
            className={item.icon ? classes.root : undefined}
            key={item.value}
            p={item.icon ? 'xs' : undefined}
            value={item.value}
            withBorder={item.icon ? true : false}
          >
            <Group>
              {item.icon ? (
                <>
                  <Radio.Indicator
                    icon={() => item.icon}
                    size="lg"
                    c="black"
                    color="gray.1"
                  />
                  <Text size="sm">{item.label}</Text>
                </>
              ) : (
                <Radio size="md" label={item.label} value={item.value} />
              )}
            </Group>
          </Radio.Card>
        ))}
      </Stack>
    </Radio.Group>
  );
}
