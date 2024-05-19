import {useField, type FieldMetadata} from '@conform-to/react';
import {Flex, rem, Stack, Switch, type SwitchGroupProps} from '@mantine/core';
import React, {useCallback} from 'react';
import type {
  CustomerLocation,
  CustomerProductLocationsItem,
} from '~/lib/api/model';
import {LocationIcon} from '../LocationIcon';

export type SwitchGroupLocations = {
  field: FieldMetadata<Array<CustomerProductLocationsItem>>;
  data: CustomerLocation[];
} & Omit<SwitchGroupProps, 'children'>;

export function SwitchGroupLocations({
  data,
  field,
  ...props
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
              metafieldId: newLocation.metafieldId,
              location: newLocation._id,
              locationType: newLocation.locationType,
              originType: newLocation.originType,
            })),
        });
      }
    },
    [data, field.name, form],
  );

  return (
    <Switch.Group
      value={list.map((l) => l.initialValue?.location!)}
      onChange={handleChange}
      {...props}
    >
      <Stack mt="xs" gap="xs">
        {data.map((l) => (
          <Flex key={l._id} align="center" gap="xs">
            <Switch
              value={l._id}
              label={l.name}
              data-testid={`location-switch-${l._id}`}
            />
            <LocationIcon
              location={l}
              style={{width: rem(16), height: rem(16)}}
            />
          </Flex>
        ))}
      </Stack>

      {list.map((item, index) => (
        <React.Fragment key={item.id}>
          <input
            hidden
            name={`${field.name}[${index}].metafieldId`}
            defaultValue={item.initialValue?.metafieldId}
          />
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
          <input
            hidden
            name={`${field.name}[${index}].originType`}
            defaultValue={item.initialValue?.originType}
          />
        </React.Fragment>
      ))}
    </Switch.Group>
  );
}
