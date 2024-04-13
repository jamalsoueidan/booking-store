import {useInputControl, type FieldMetadata} from '@conform-to/react';
import {Group, TextInput} from '@mantine/core';
import {format, set} from 'date-fns';

export type DateTimeInputProps = {
  field: FieldMetadata<string>;
  labels: {
    date: string;
    time: string;
  };
};

export default function DateTimeInput({field, labels}: DateTimeInputProps) {
  const control = useInputControl(field);

  return (
    <Group>
      <TextInput
        value={field.value ? format(new Date(field.value), 'yyyy-MM-dd') : ''}
        onChange={({currentTarget}: React.ChangeEvent<HTMLInputElement>) => {
          const updatedDate = new Date(currentTarget.value);
          control.change(updatedDate.toJSON());
        }}
        type="date"
        label={labels.date}
        style={{flex: 1}}
      />

      <TextInput
        label={labels.time}
        disabled={!field.value}
        value={field.value ? format(new Date(field.value), 'HH:mm') : '08:00'}
        style={{flex: 1}}
        type="time"
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
