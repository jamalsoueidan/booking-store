import {Box, Container, type BoxProps} from '@mantine/core';
import classes from './Wrapper.module.css';

export function Wrapper({
  children,
  variant,
  ...props
}: BoxProps & {children: React.ReactNode; variant?: 'frontpage'}) {
  const className = variant ? classes.root : undefined;
  return (
    <Box my="xl" className={className} {...props}>
      <Container size="lg">{children}</Container>
    </Box>
  );
}
