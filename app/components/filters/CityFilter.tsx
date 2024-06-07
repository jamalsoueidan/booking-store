import {Button, Select} from '@mantine/core';
import {IconWorld, IconX} from '@tabler/icons-react';
import {useChangeFilter} from './useChangeFilter';

export function RemoveCityFilterButton() {
  const {label, onChange} = useChangeFilter('city');
  if (!label) {
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
      leftSection={<IconWorld />}
    >
      {label}
    </Button>
  );
}

export function AddCityFilter({tags}: {tags: string[]}) {
  const {value, onChange} = useChangeFilter('city');

  const data = tags.sort().map((p) => ({
    label: `${p[0].toUpperCase()}${p.substring(1)}`,
    value: p,
  }));

  return (
    <Select
      size="md"
      value={value}
      label="Vis skønhedseksperter fra byer:"
      placeholder="Alle byer"
      onChange={onChange}
      leftSection={<IconWorld />}
      data={data}
      clearable
    />
  );
}
