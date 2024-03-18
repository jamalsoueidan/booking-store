import {Box, Container, type BoxComponentProps} from '@mantine/core';

export function HeroBackground({
  children,
  ...props
}: BoxComponentProps & {children: React.ReactNode}) {
  return (
    <Box
      bg={props.bg}
      style={{
        position: 'relative',
        marginTop: '-70px',
        paddingTop: '70px',
        borderBottomRightRadius: '40% 15%',
        borderBottomLeftRadius: '40% 15%',
        ...props.style,
      }}
    >
      {props.style ? (
        <div
          style={{
            backgroundColor: 'white',
            position: 'absolute',
            borderBottomRightRadius: '40% 15%',
            borderBottomLeftRadius: '40% 15%',
            left: 0,
            right: 0,
            bottom: 0,
            top: 0,
            opacity: 0.5,
          }}
        ></div>
      ) : null}
      <Container
        size="lg"
        py={0}
        h={props.h}
        style={{position: 'relative', zIndex: 1}}
      >
        {children}
      </Container>
    </Box>
  );
}
