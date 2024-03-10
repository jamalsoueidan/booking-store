import {type FieldMetadata} from '@conform-to/react';
import {Stack, Switch} from '@mantine/core';
import React, {useCallback, useState} from 'react';
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
  const initialValue = field
    .getFieldList()
    .filter(
      (item) =>
        !!item.initialValue &&
        !!item.initialValue.location &&
        !!item.initialValue.locationType,
    )
    .map((item) => ({
      ...(item.initialValue as CustomerProductLocationsItem),
    }));

  const [list, setList] =
    useState<Array<CustomerProductLocationsItem>>(initialValue);

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

      {list.map((item, index) => (
        <React.Fragment key={item.location}>
          <input
            hidden
            name={`${field.name}[${index}].location`}
            defaultValue={item.location}
          />
          <input
            hidden
            name={`${field.name}[${index}].locationType`}
            defaultValue={item.locationType}
          />
        </React.Fragment>
      ))}
    </Switch.Group>
  );
}
