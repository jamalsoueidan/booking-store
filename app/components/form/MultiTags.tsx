import {
  list,
  requestIntent,
  useFieldList,
  type FieldConfig,
} from '@conform-to/react';
import {MultiSelect} from '@mantine/core';
import React, {useRef} from 'react';

interface MultiTagsProps {
  field: FieldConfig<any>;
  name: string;
  data: {label: string; value: string}[];
  label: string;
  placeholder: string;
}

export const MultiTags: React.FC<MultiTagsProps> = ({
  field,
  name,
  data,
  label,
  placeholder,
}) => {
  const ref = useRef<HTMLFieldSetElement>(null);
  const fieldList = useFieldList<Array<string>>(ref, field);

  const handleChange = (value: string[]) => {
    fieldList.forEach((item, index) => {
      const exist = value.findIndex((l) => l === item.defaultValue);
      if (exist === -1) {
        requestIntent(ref.current?.form, list.remove(name, {index}));
      }
    });

    value.forEach((itemValue, index) => {
      const exist = fieldList.findIndex(
        (item) => item.defaultValue === itemValue,
      );

      if (exist === -1) {
        requestIntent(
          ref.current?.form,
          list.insert(name, {defaultValue: itemValue, index}),
        );
      }
    });
  };

  return (
    <fieldset ref={ref}>
      <MultiSelect
        data={data}
        label={label}
        placeholder={placeholder}
        defaultValue={field.defaultValue}
        onChange={handleChange}
      />
      {/* Render hidden inputs for each selected item */}
      {fieldList.map((item) => (
        <input
          type="hidden"
          key={item.key}
          defaultValue={item.defaultValue}
          name={item.name}
        />
      ))}
    </fieldset>
  );
};
