import {
  list,
  requestIntent,
  useFieldList,
  type FieldConfig,
  type useForm,
} from '@conform-to/react';
import {MultiSelect} from '@mantine/core';
import React from 'react';

interface MultiTagsProps {
  form: ReturnType<typeof useForm>[0];
  field: FieldConfig<any>;
  name: string;
  data: {label: string; value: string}[];
  label: string;
  placeholder: string;
  defaultValue: string[];
}

// Custom MultiSelect component that integrates with @conform-to/react
export const MultiTags: React.FC<MultiTagsProps> = ({
  form,
  field,
  name,
  data,
  label,
  placeholder,
  defaultValue,
}) => {
  const fieldList = useFieldList<Array<string>>(form.ref, field);

  const handleChange = (value: string[]) => {
    fieldList.forEach(() => {
      requestIntent(form.ref.current, list.remove(name, {index: 0}));
    });

    value.forEach((itemValue, index) => {
      requestIntent(
        form.ref.current,
        list.insert(name, {defaultValue: itemValue, index}),
      );
    });
  };

  return (
    <>
      <MultiSelect
        data={data}
        label={label}
        placeholder={placeholder}
        defaultValue={defaultValue}
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
    </>
  );
};
