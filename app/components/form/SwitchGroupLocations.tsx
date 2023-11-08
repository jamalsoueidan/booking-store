import {
  conform,
  list,
  requestIntent,
  useFieldList,
  useFieldset,
  type FieldConfig,
} from '@conform-to/react';
import {Stack, Switch} from '@mantine/core';
import {useRef} from 'react';
import type {
  CustomerLocation,
  CustomerProductLocations,
  CustomerProductLocationsItem,
} from '~/lib/api/model';

export type SwitchGroupLocations = {
  label: string;
  field: FieldConfig<CustomerProductLocations>;
  data: CustomerLocation[];
};

export function SwitchGroupLocations({
  label,
  data,
  field,
}: SwitchGroupLocations) {
  const ref = useRef<HTMLFieldSetElement>(null);
  const fieldList = useFieldList<Array<CustomerProductLocationsItem>>(
    ref,
    field,
  );

  const handleChange = (value: string[]) => {
    // remove all olds
    fieldList.forEach((item, index) => {
      const exist = value.findIndex((l) => l === item.defaultValue.location);

      if (exist === -1) {
        requestIntent(ref.current?.form, list.remove(field.name, {index}));
      }
    });

    value.forEach((locationId) => {
      const exist = fieldList.findIndex(
        (item) => item.defaultValue.location === locationId,
      );

      if (exist === -1) {
        const newLocation = data.find(
          (location) => location._id === locationId,
        );

        if (!newLocation) {
          return;
        }

        requestIntent(
          ref.current?.form,
          list.insert(field.name, {
            defaultValue: {
              location: newLocation._id,
              locationType: newLocation.locationType,
            },
          }),
        );
      }
    });
  };

  return (
    <fieldset ref={ref}>
      <Switch.Group
        defaultValue={field.defaultValue?.map((l) => l.location)}
        label={label}
        onChange={handleChange}
      >
        <Stack mt="xs" gap="xs">
          {data.map((l) => (
            <Switch key={l._id} value={l._id} label={l.name} />
          ))}
        </Stack>

        {fieldList.map((field) => (
          <SwitchItem key={field.key} field={field} />
        ))}
      </Switch.Group>
    </fieldset>
  );
}

type SwitchItemProps = {
  field: FieldConfig<CustomerProductLocationsItem>;
};

function SwitchItem({field}: SwitchItemProps) {
  const ref = useRef<HTMLFieldSetElement>(null);
  const {location, locationType} = useFieldset(ref, field);

  return (
    <fieldset ref={ref}>
      <input {...conform.input(location, {hidden: true})} />
      <input {...conform.input(locationType, {hidden: true})} />
    </fieldset>
  );
}
