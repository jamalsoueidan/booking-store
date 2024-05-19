import {useInputControl, type FieldMetadata} from '@conform-to/react';
import {NumberInput, type NumberInputProps} from '@mantine/core';
import {useRef} from 'react';

type AmountInputProps = {
  field: FieldMetadata<{amount?: string; currencyCode?: string} | undefined>;
} & NumberInputProps;

export function AmountInput({field, ...props}: AmountInputProps) {
  const inputRef = useRef<HTMLDivElement>(null);
  const price = field.getFieldset();
  const control = useInputControl(price.amount);

  return !props.hidden ? (
    <NumberInput
      ref={inputRef}
      defaultValue={parseInt(price.amount.initialValue || '0')}
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
