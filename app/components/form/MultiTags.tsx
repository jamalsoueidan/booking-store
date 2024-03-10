import {useField, type FieldMetadata} from '@conform-to/react';
import {MultiSelect} from '@mantine/core';
import React, {useCallback} from 'react';

interface MultiTagsProps {
  field: FieldMetadata<Array<string>>;
  data: {label: string; value: string}[];
  label: string;
  placeholder: string;
}

export const MultiTags: React.FC<MultiTagsProps> = ({
  field,
  data,
  label,
  placeholder,
}) => {
  const [, form] = useField(field.name);
  const list = field.getFieldList();
  const defaultValue = list.map((item) => item.initialValue) as string[];

  const handleChange = useCallback(
    (value: string[]) => {
      form.update({
        name: field.name,
        value,
      });
    },
    [field.name, form],
  );

  return (
    <fieldset>
      <MultiSelect
        data={data}
        label={label}
        defaultValue={defaultValue}
        placeholder={placeholder}
        onChange={handleChange}
      />

      {list.map((item) => (
        <input
          hidden
          key={item.key}
          defaultValue={item.initialValue}
          name={item.name}
        />
      ))}
    </fieldset>
  );
};
