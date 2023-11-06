import {TextInput} from '@mantine/core';
import type {FC} from 'react';
import {useField} from 'remix-validated-form';

export type TextFieldProps = {
  label: string;
  name: string;
  value?: string;
  placeholder?: string;
};

export const TextField: FC<TextFieldProps> = ({
  label,
  name,
  value,
  placeholder,
}) => {
  const {getInputProps} = useField(name);
  return (
    <TextInput
      label={label}
      placeholder={placeholder}
      {...getInputProps({type: 'text', value})}
    />
  );
};
