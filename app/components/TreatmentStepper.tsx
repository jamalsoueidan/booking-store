import {Group, Text} from '@mantine/core';

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
