import {useInputControl, type FieldMetadata} from '@conform-to/react';
import {NumberInput, type NumberInputProps} from '@mantine/core';
import {useRef} from 'react';

type AmountInputProps = {
  field: FieldMetadata<number | string>;
} & NumberInputProps;

export function NumericInput({field, ...props}: AmountInputProps) {
  const inputRef = useRef<HTMLDivElement>(null);
  const control = useInputControl(field);

  return !props.hidden ? (
    <NumberInput
      ref={inputRef}
      defaultValue={parseInt(field.initialValue || '0')}
      onChange={(value: string | number) => {
        control.change(value.toString());
      }}
      allowNegative={false}
      allowDecimal={false}
      {...props}
    />
  ) : (
    <></>
  );
}
