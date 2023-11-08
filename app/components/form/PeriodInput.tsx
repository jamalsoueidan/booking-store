import {conform, useFieldset, type FieldConfig} from '@conform-to/react';
import {Flex, Select, TextInput} from '@mantine/core';
import {useRef} from 'react';
import {
  type CustomerProductBookingPeriod,
  type CustomerProductNoticePeriod,
} from '~/lib/api/model';

export type PeriodInputProps = {
  data: Array<{label: string; value: string}>;
  label: string;
  field: FieldConfig<
    CustomerProductBookingPeriod | CustomerProductNoticePeriod
  >;
};

export default function PeriodInput({data, label, field}: PeriodInputProps) {
  const ref = useRef<HTMLFieldSetElement>(null);
  const noticePeriod = useFieldset(ref, field);

  return (
    <fieldset ref={ref}>
      <Flex align={'flex-end'} gap="xs">
        <TextInput
          label={label}
          w="70%"
          {...conform.input(noticePeriod.value)}
        />
        <Select
          w="30%"
          data={data}
          {...conform.select(noticePeriod.unit)}
          defaultValue={field.defaultValue.unit}
        />
      </Flex>
    </fieldset>
  );
}
