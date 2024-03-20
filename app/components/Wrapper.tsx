import {Box, Container, type BoxProps} from '@mantine/core';
import classes from './Wrapper.module.css';

export function Wrapper({
  children,
  ...props
}: BoxProps & {children: React.ReactNode}) {
  const className = props.bg ? classes.padding : classes.margin;
  return (
    <Box className={className} {...props}>
      <Container size="md">{children}</Container>
    </Box>
  );
}
