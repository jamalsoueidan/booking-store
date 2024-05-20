import {Tooltip, type CheckIconProps} from '@mantine/core';
import {IconBuilding, IconCar, IconHome} from '@tabler/icons-react';
import type {CustomerLocationBase} from '~/lib/api/model';

export function LocationIcon({
  location,
  withTooltip = true,
  ...props
}: {
  location: Pick<CustomerLocationBase, 'locationType' | 'originType'>;
  withTooltip?: boolean;
} & CheckIconProps) {
  if (location.locationType === 'destination') {
    return (
      <ConditionalTooltip label="Kører til dig" withTooltip={withTooltip}>
        <IconCar {...props} />
      </ConditionalTooltip>
    );
  }

  if (location.originType === 'home') {
    return (
      <ConditionalTooltip label="Salon" withTooltip={withTooltip}>
        <IconHome {...props} />
      </ConditionalTooltip>
    );
  }

  return (
    <ConditionalTooltip label="Hjemme" withTooltip={withTooltip}>
      <IconBuilding {...props} />
    </ConditionalTooltip>
  );
}

export function LocationIconTooltip({
  location,
  children,
}: {
  location: Pick<CustomerLocationBase, 'locationType' | 'originType'>;
  children: React.ReactNode;
}) {
  if (location.locationType === 'destination') {
    return (
      <ConditionalTooltip label="Kører til din lokation" withTooltip={true}>
        {children}
      </ConditionalTooltip>
    );
  }

  if (location.originType === 'home') {
    return (
      <ConditionalTooltip label="Salon" withTooltip={true}>
        {children}
      </ConditionalTooltip>
    );
  }

  return (
    <ConditionalTooltip label="Hjemme" withTooltip={true}>
      {children}
    </ConditionalTooltip>
  );
}

type ConditionalTooltipProps = {
  label: string;
  withTooltip?: boolean;
  children: React.ReactNode;
};

function ConditionalTooltip({
  label,
  withTooltip = true,
  children,
}: ConditionalTooltipProps) {
  return withTooltip ? (
    <Tooltip label={label}>{children}</Tooltip>
  ) : (
    <>{children}</>
  );
}
