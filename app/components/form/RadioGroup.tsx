import {useInputControl, type FieldMetadata} from '@conform-to/react';
import {Group, Radio, Stack} from '@mantine/core';
import {
  IconBuildingStore,
  IconCar,
  IconHome,
  IconPhone,
} from '@tabler/icons-react';
import React, {useMemo} from 'react';
import {CustomerLocationBaseLocationType} from '~/lib/api/model';

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
    <Radio.Group
      size="lg"
      defaultValue={initialValue}
      onChange={control.change}
      {...props}
    >
      <Stack gap="xs" mt="xs">
        {data.map((d) => (
          <React.Fragment key={d.value}>
            <Group>
              <Radio size="md" label={d.label} value={d.value} />
              {d.value === CustomerLocationBaseLocationType.home && (
                <IconHome size={20} />
              )}
              {d.value === CustomerLocationBaseLocationType.commercial && (
                <IconBuildingStore size={20} />
              )}
              {d.value === CustomerLocationBaseLocationType.destination && (
                <IconCar size={20} />
              )}
              {d.value === CustomerLocationBaseLocationType.virtual && (
                <IconPhone size={20} />
              )}
            </Group>
          </React.Fragment>
        ))}
      </Stack>
    </Radio.Group>
  );
}
