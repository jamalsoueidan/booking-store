import {conform, useInputEvent, type FieldConfig} from '@conform-to/react';
import {Select} from '@mantine/core';
import {useRef, useState} from 'react';

export type SelectSearchableProps = {
  onChange?: (value: string | null) => void;
  label: string;
  placeholder?: string;
  field: FieldConfig<string>;
  data: Array<{label: string; value: string}>;
};

export function SelectSearchable({
  onChange,
  label,
  placeholder,
  data,
  field,
}: SelectSearchableProps) {
  const [value, setValue] = useState(field.defaultValue ?? '');

  const shadowInputRef = useRef<HTMLInputElement>(null);
  const customInputRef = useRef<HTMLInputElement>(null);

  const control = useInputEvent({
    ref: shadowInputRef,
    onReset: () => setValue(field.defaultValue ?? ''),
  });

  return (
    <>
      <input
        ref={shadowInputRef}
        {...conform.input(field, {hidden: true})}
        onChange={(e) => setValue(e.target.value)}
        onFocus={() => customInputRef.current?.focus()}
      />

      <Select
        ref={customInputRef}
        label={label}
        placeholder={placeholder}
        value={value}
        onChange={(value) => {
          if (value) {
            control.change(value);
          }
          if (onChange) {
            onChange(value);
          }
        }}
        onDropdownClose={control.blur}
        data={data}
        nothingFoundMessage="Intet fundet..."
        error={field.error}
        searchable
      />
    </>
  );
}
