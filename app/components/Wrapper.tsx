import {Box, Container, type BoxProps} from '@mantine/core';

export function Wrapper({
  children,
  ...props
}: BoxProps & {children: React.ReactNode}) {
  return (
    <Box my="xl" {...props}>
      <Container size="lg">{children}</Container>
    </Box>
  );
}
