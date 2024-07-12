import {useField, type FieldMetadata} from '@conform-to/react';
import {MultiSelect, type MultiSelectProps} from '@mantine/core';
import React, {useCallback} from 'react';

export type MultiTagsProps = {
  field: FieldMetadata<Array<string>>;
  data: {label: string; value: string}[];
} & MultiSelectProps;

export const MultiTags: React.FC<MultiTagsProps> = ({field, ...props}) => {
  const [, fields] = useField(field.name);
  const list = field.getFieldList();
  const defaultValue = list.map((item) => item.initialValue) as string[];

  const handleChange = useCallback(
    (value: string[]) => {
      fields.update({
        name: field.name,
        value,
        validated: false,
      });
    },
    [field.name, fields],
  );

  return (
    <>
      <MultiSelect value={defaultValue} onChange={handleChange} {...props} />

      {list.map((item) => (
        <input
          hidden
          key={item.key}
          defaultValue={item.initialValue}
          name={item.name}
        />
      ))}
    </>
  );
};
