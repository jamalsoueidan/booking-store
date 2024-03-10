import {useInputControl, type FieldMetadata} from '@conform-to/react';
import {ActionIcon, Group, rem} from '@mantine/core';
import {DateInput, TimeInput, type DateValue} from '@mantine/dates';
import {IconClock} from '@tabler/icons-react';
import {format, set} from 'date-fns';
import {da} from 'date-fns/locale';
import {useRef} from 'react';

export type DateTimeInputProps = {
  field: FieldMetadata<string>;
  labels: {
    date: string;
    time: string;
  };
};

export default function DateTimeInput({field, labels}: DateTimeInputProps) {
  const inputRef = useRef<HTMLDivElement>(null);
  const control = useInputControl(field);

  const timerRef = useRef<HTMLInputElement>(null);
  const timerControl = (
    <ActionIcon
      variant="subtle"
      color="gray"
      onClick={() => timerRef.current?.showPicker()}
    >
      <IconClock style={{width: rem(16), height: rem(16)}} stroke={1.5} />
    </ActionIcon>
  );

  return (
    <Group>
      <input
        name={field.name}
        tabIndex={-1}
        onFocus={() => inputRef.current?.focus()}
        hidden
      />

      <DateInput
        onChange={(startDate: DateValue) => {
          if (field.value && startDate) {
            const updatedDate = set(new Date(field.value), {
              year: startDate.getFullYear(),
              month: startDate.getMonth(), // date-fns months are 0-indexed
              date: startDate.getDate(),
            });

            return control.change(updatedDate.toJSON());
          }
          control.change(startDate?.toJSON());
        }}
        label={labels.date}
        style={{flex: 1}}
        locale="da"
        clearable
      />

      <TimeInput
        label={labels.time}
        disabled={!field.value}
        value={
          field.value
            ? format(new Date(field.value), 'HH:mm', {locale: da})
            : '00:00'
        }
        ref={timerRef}
        rightSection={timerControl}
        style={{flex: 1}}
        onChange={({currentTarget}: React.ChangeEvent<HTMLInputElement>) => {
          if (field.value && currentTarget.value) {
            const [hours, minutes] = currentTarget.value.split(':').map(Number);
            const newTime = set(new Date(field.value), {
              hours,
              minutes,
            });
            control.change(newTime.toJSON());
          }
        }}
      />
    </Group>
  );
}
