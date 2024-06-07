import {Tooltip, type CheckIconProps} from '@mantine/core';
import {IconBuildingStore, IconCar, IconHome} from '@tabler/icons-react';
import type {CustomerLocationBase} from '~/lib/api/model';

export function LocationIcon({
  location,
  withTooltip = true,
  ...props
}: {
  location: Pick<CustomerLocationBase, 'locationType'>;
  withTooltip?: boolean;
} & CheckIconProps) {
  if (location.locationType === 'destination') {
    return (
      <ConditionalTooltip
        label="Kører ud til din adresse"
        withTooltip={withTooltip}
      >
        <IconCar {...props} />
      </ConditionalTooltip>
    );
  }

  if (location.locationType === 'home') {
    return (
      <ConditionalTooltip label="I Hjem" withTooltip={withTooltip}>
        <IconHome {...props} />
      </ConditionalTooltip>
    );
  }

  return (
    <ConditionalTooltip label="I Salon" withTooltip={withTooltip}>
      <IconBuildingStore {...props} />
    </ConditionalTooltip>
  );
}

export function LocationText({
  location,
}: {
  location: Pick<CustomerLocationBase, 'locationType'>;
}) {
  if (location.locationType === 'destination') {
    return <>Kører ud til din lokation</>;
  }

  if (location.locationType === 'home') {
    return <>Hjemme</>;
  }

  return <>Salon</>;
}

export function LocationIconTooltip({
  location,
  children,
}: {
  location: Pick<CustomerLocationBase, 'locationType'>;
  children: React.ReactNode;
}) {
  if (location.locationType === 'destination') {
    return (
      <ConditionalTooltip label="Kører ud til din lokation" withTooltip={true}>
        {children}
      </ConditionalTooltip>
    );
  }

  if (location.locationType === 'home') {
    return (
      <ConditionalTooltip label="Hjemme" withTooltip={true}>
        {children}
      </ConditionalTooltip>
    );
  }

  return (
    <ConditionalTooltip label="Salon" withTooltip={true}>
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
