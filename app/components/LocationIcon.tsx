import {Tooltip, type CheckIconProps} from '@mantine/core';
import {IconBuilding, IconCar, IconHome} from '@tabler/icons-react';
import type {CustomerLocationBase} from '~/lib/api/model';

export function LocationIcon({
  location,
  ...props
}: {
  location: Pick<CustomerLocationBase, 'locationType' | 'originType'>;
} & CheckIconProps) {
  if (location.locationType === 'destination') {
    <Tooltip label="Kører til dig">
      <IconCar {...props} />
    </Tooltip>;
  }

  if (location.originType === 'home') {
    return (
      <Tooltip label="Salon">
        <IconHome {...props} />
      </Tooltip>
    );
  }

  return (
    <Tooltip label="Hjemme">
      <IconBuilding {...props} />
    </Tooltip>
  );
}
