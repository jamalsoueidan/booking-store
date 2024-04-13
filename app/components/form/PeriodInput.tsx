import {
  getInputProps,
  getSelectProps,
  type FieldMetadata,
} from '@conform-to/react';
import {Flex, Select, TextInput, type TextInputProps} from '@mantine/core';
import {
  type CustomerProductBookingPeriod,
  type CustomerProductNoticePeriod,
} from '~/lib/api/model';

export type PeriodInputProps = {
  data: Array<{label: string; value: string}>;
  field: FieldMetadata<
    CustomerProductBookingPeriod | CustomerProductNoticePeriod
  >;
} & TextInputProps;

export default function PeriodInput({data, field, ...props}: PeriodInputProps) {
  const noticePeriod = field.getFieldset();

  return (
    <Flex align={'flex-end'} gap="md">
      <TextInput
        w="70%"
        {...props}
        {...getInputProps(noticePeriod.value, {type: 'number'})}
      />
      <Select
        w="30%"
        data={data}
        allowDeselect={false}
        {...getSelectProps(noticePeriod.unit)}
        defaultValue={field.initialValue?.unit}
      />
    </Flex>
  );
}
