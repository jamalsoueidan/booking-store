import {type FieldConfig} from '@conform-to/react';
import {Stack, Switch} from '@mantine/core';
import {useCallback, useState} from 'react';
import type {
  CustomerLocation,
  CustomerProductLocations,
  CustomerProductLocationsItem,
} from '~/lib/api/model';

export type SwitchGroupLocations = {
  label: string;
  description?: string;
  field: FieldConfig<CustomerProductLocations>;
  data: CustomerLocation[];
};

export function SwitchGroupLocations({
  label,
  description,
  data,
  field,
}: SwitchGroupLocations) {
  const [list, setList] = useState<Array<CustomerProductLocationsItem>>(
    field.defaultValue || [],
  );

  const handleChange = useCallback(
    (value: string[]) => {
      if (value.length === 0) {
        return;
      }

      const locations: Array<CustomerProductLocationsItem> = [];
      value.forEach((locationId) => {
        const newLocation = data.find(
          (location) => location._id === locationId,
        );

        if (newLocation) {
          locations.push({
            location: newLocation._id,
            locationType: newLocation.locationType,
          });
        }
      });

      setList(locations);
    },
    [data],
  );

  return (
    <Switch.Group
      description={description}
      value={list.map((l) => l.location)}
      label={label}
      onChange={handleChange}
    >
      <Stack mt="xs" gap="xs">
        {data.map((l) => (
          <Switch key={l._id} value={l._id} label={l.name} />
        ))}
      </Stack>

      {list.map((item, index) =>
        Object.keys(item).map((key: any) => (
          <input
            hidden
            key={`${item.location}.${key}`}
            name={`${field.name}[${index}].${key}`}
            defaultValue={item[key as keyof CustomerProductLocationsItem]}
          />
        )),
      )}
    </Switch.Group>
  );
}
