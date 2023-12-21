import {Box, Container, type BoxComponentProps} from '@mantine/core';

export function HeroBackground({
  children,
  ...props
}: BoxComponentProps & {children: React.ReactNode}) {
  return (
    <Box
      {...props}
      style={{
        marginTop: '-70px',
        paddingTop: '70px',
        borderBottomRightRadius: '40% 15%',
        borderBottomLeftRadius: '40% 15%',
        ...props.style,
      }}
    >
      <Container size="lg" py={0} h="100%">
        {children}
      </Container>
    </Box>
  );
}
