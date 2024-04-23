import {useField, type FieldMetadata} from '@conform-to/react';
import {Stack, Switch} from '@mantine/core';
import React, {useCallback} from 'react';
import type {
  CustomerLocation,
  CustomerProductLocationsItem,
} from '~/lib/api/model';

export type SwitchGroupLocations = {
  label: string;
  description?: string;
  field: FieldMetadata<Array<CustomerProductLocationsItem>>;
  data: CustomerLocation[];
};

export function SwitchGroupLocations({
  label,
  description,
  data,
  field,
}: SwitchGroupLocations) {
  const [, form] = useField(field.name);
  const list = field.getFieldList();

  const handleChange = useCallback(
    (value: string[]) => {
      if (value.length > 0) {
        form.update({
          name: field.name,
          value: value
            .map((locationId) =>
              data.find((location) => location._id === locationId),
            )
            .filter(Boolean) // This removes any undefined or null values that were not found in the data array
            .map((newLocation) => ({
              location: newLocation._id,
              locationType: newLocation.locationType,
            })),
        });
      }
    },
    [data, field.name, form],
  );

  return (
    <Switch.Group
      description={description}
      value={list.map((l) => l.initialValue?.location!)}
      label={label}
      onChange={handleChange}
    >
      <Stack mt="xs" gap="xs">
        {data.map((l) => (
          <Switch
            key={l._id}
            value={l._id}
            label={l.name}
            data-testid={`location-switch-${l._id}`}
          />
        ))}
      </Stack>

      {list.map((item, index) => (
        <React.Fragment key={item.id}>
          <input
            hidden
            name={`${field.name}[${index}].location`}
            defaultValue={item.initialValue?.location}
          />
          <input
            hidden
            name={`${field.name}[${index}].locationType`}
            defaultValue={item.initialValue?.locationType}
          />
        </React.Fragment>
      ))}
    </Switch.Group>
  );
}
