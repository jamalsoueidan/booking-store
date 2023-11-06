import {MultiSelect} from '@mantine/core';
import {useFieldArray} from 'remix-validated-form';

type MultiTagsProps = {
  options: Array<{label: string; value: string}>;
  name: string;
  label: string;
  placeholder: string;
};

export const MultiTags = ({
  options,
  name,
  label,
  placeholder,
}: MultiTagsProps) => {
  const [items, {push, remove, pop}] = useFieldArray(name);

  const onChange = (value: string[]) => {
    console.log(items, options, value);
  };

  return (
    <MultiSelect
      label={label}
      placeholder={placeholder}
      name={name}
      data={options}
      onChange={onChange}
    />
  );
};
