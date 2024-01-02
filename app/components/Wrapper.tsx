import {Box, Container, type BoxProps} from '@mantine/core';
import classes from './Wrapper.module.css';

export function Wrapper({
  children,
  variant,
  ...props
}: BoxProps & {children: React.ReactNode; variant?: 'frontpage'}) {
  const className = props.bg ? classes.root : classes.padding;
  return (
    <Box className={className} {...props}>
      <Container size="lg">{children}</Container>
    </Box>
  );
}
