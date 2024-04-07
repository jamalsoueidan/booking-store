import {Group, Text} from '@mantine/core';

const paths = [
  {
    title: '',
    path: '',
  },
  {
    title: 'Lokation',
    path: 'pick-location',
    required: ['locationId'],
    text: 'Vælge en lokation før du kan forsætte...',
  },
  {
    title: 'Flere behandlinger',
    path: 'pick-more',
  },
  {
    title: 'Dato & Tid',
    path: 'pick-datetime',
    required: ['fromDate', 'toDate'],
    text: 'Vælge en tid før du kan forsætte...',
  },
  {
    title: 'Køb',
    path: 'completed',
  },
];

export const TreatmentStepper = ({
  currentStep,
  totalSteps,
  pageTitle,
  children,
}: {
  currentStep?: number;
  totalSteps?: number;
  pageTitle?: string;
  children: React.ReactNode;
}) => {
  return (
    <Group justify="space-between">
      <Group gap="xs">
        {currentStep ? (
          <Text c="dimmed" fz={{base: 16, sm: 20}}>
            {currentStep}/{totalSteps}
          </Text>
        ) : null}
        {pageTitle ? (
          <Text fw={500} tt="uppercase" fz={{base: 16, sm: 20}}>
            {pageTitle}
          </Text>
        ) : null}
      </Group>
      <Group gap="md">{children}</Group>
    </Group>
  );
};
