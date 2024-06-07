import {type FieldMetadata} from '@conform-to/react';
import {Flex, rem, Stack, Switch, type SwitchGroupProps} from '@mantine/core';
import React, {useCallback, useEffect, useState} from 'react';
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
  const [list, setList] = useState<Array<CustomerLocation>>([data[0]]);

  const handleChange = useCallback(
    (value: string[]) => {
      const result = data.filter((d) => value.some((v) => v === d._id));
      setList(result);
    },
    [data],
  );

  useEffect(() => {
    if (field.initialValue) {
      const result = data.filter((d) =>
        (field.initialValue as Array<CustomerProductLocationsItem>).some(
          (v) => v.location === d._id,
        ),
      );
      setList(result);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Switch.Group
      value={list.map((l) => l._id)}
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
        <React.Fragment key={item._id}>
          <input
            hidden
            name={`${field.name}[${index}].location`}
            defaultValue={item._id}
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
