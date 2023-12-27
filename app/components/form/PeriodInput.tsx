import {conform, useFieldset, type FieldConfig} from '@conform-to/react';
import {Flex, Select, TextInput, type TextInputProps} from '@mantine/core';
import {useRef} from 'react';
import {
  type CustomerProductBookingPeriod,
  type CustomerProductNoticePeriod,
} from '~/lib/api/model';

export type PeriodInputProps = {
  data: Array<{label: string; value: string}>;
  field: FieldConfig<
    CustomerProductBookingPeriod | CustomerProductNoticePeriod
  >;
} & TextInputProps;

export default function PeriodInput({data, field, ...props}: PeriodInputProps) {
  const ref = useRef<HTMLFieldSetElement>(null);
  const noticePeriod = useFieldset(ref, field);

  return (
    <fieldset ref={ref}>
      <Flex align={'flex-end'} gap="xs">
        <TextInput w="70%" {...props} {...conform.input(noticePeriod.value)} />
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
