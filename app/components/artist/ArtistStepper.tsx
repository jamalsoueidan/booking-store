import {Box, Stepper, Text, Title, type StepperProps} from '@mantine/core';
import {useMediaQuery} from '@mantine/hooks';

export function ArtistStepper({
  children,
  active,
  title,
  description,
}: StepperProps & {title: string; description: string}) {
  const isMobile = useMediaQuery('(max-width: 48em)');

  const header = (
    <div>
      <Title order={2} tt="uppercase" ta="center" mb="md">
        {title}
      </Title>
      <Text c="dimmed" ta="center">
        {description}
      </Text>
    </div>
  );

  const content = (
    <Box p={{sm: 'lg'}}>
      {header}
      {children}
    </Box>
  );

  return (
    <Stepper
      color="pink"
      active={active}
      orientation={isMobile ? 'vertical' : 'horizontal'}
    >
      <Stepper.Step label="Lokation" description="Hvor skal behandling ske?">
        {active === 0 ? content : null}
      </Stepper.Step>
      <Stepper.Step
        label="Behandlinger"
        description="Hvilken behandlinger skal laves?"
      >
        {active === 1 ? content : null}
      </Stepper.Step>
      <Stepper.Step
        label="Dato & Tid"
        description="Hvornår skal behandling ske?"
      >
        {active === 2 ? content : null}
      </Stepper.Step>
      <Stepper.Completed>{active === 3 ? content : null}</Stepper.Completed>
    </Stepper>
  );
}
