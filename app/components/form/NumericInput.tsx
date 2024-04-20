import {useInputControl, type FieldMetadata} from '@conform-to/react';
import {NumberInput, type NumberInputProps} from '@mantine/core';
import {useRef} from 'react';

type NumericInputProps = {
  field: FieldMetadata<number>;
} & NumberInputProps;

export function NumericInput({field, ...props}: NumericInputProps) {
  const inputRef = useRef<HTMLDivElement>(null);
  const control = useInputControl(field);

  return (
    <>
      <input
        name={field.name}
        defaultValue={field.initialValue}
        tabIndex={-1}
        onFocus={() => inputRef.current?.focus()}
        className="hidden-input"
      />

      {!props.hidden ? (
        <NumberInput
          ref={inputRef}
          defaultValue={parseInt(field.initialValue || '0')}
          onChange={(value: string | number) => {
            control.change(value as any);
          }}
          onBlur={control.blur}
          allowNegative={false}
          allowDecimal={false}
          {...props}
        />
      ) : null}
    </>
  );
}
