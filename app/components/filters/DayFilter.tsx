import {Button, Checkbox, Group, InputLabel, Stack} from '@mantine/core';
import {IconWorldCheck, IconX} from '@tabler/icons-react';
import {useChangeFilter} from './useChangeFilter';

export function RemoveDayFilterButton() {
  const {value, onChange} = useChangeFilter('days');
  const transform = value?.split(',').filter((p) => p.length > 0);

  if (!transform) {
    return null;
  }

  return (
    <Button
      variant="outline"
      c="black"
      color="gray.3"
      onClick={() => onChange(null)}
      size="md"
      rightSection={<IconX />}
      leftSection={<IconWorldCheck />}
    >
      Arbejdsdage valg
    </Button>
  );
}

export function AddDayFilter() {
  const {value, onChange} = useChangeFilter('days');
  const transform = value?.split(',').filter((p) => p.length > 0);

  return (
    <div>
      <Group gap="xs" mb="xs">
        <IconWorldCheck />
        <InputLabel size="md">Skønhedsekspert arbejdsdage?</InputLabel>
      </Group>
      <Checkbox.Group value={transform} onChange={onChange}>
        <Stack gap="3px">
          <Checkbox value="monday" label="Mandag" />
          <Checkbox value="tuesday" label="Tirsdag" />
          <Checkbox value="wednesday" label="Onsdag" />
          <Checkbox value="thursday" label="Torsdag" />
          <Checkbox value="friday" label="Fredag" />
          <Checkbox value="saturday" label="Lørdag" />
          <Checkbox value="sunday" label="Søndag" />
        </Stack>
      </Checkbox.Group>
    </div>
  );
}
