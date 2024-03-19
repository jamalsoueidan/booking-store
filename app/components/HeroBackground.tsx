import {Box, Container, type BoxComponentProps} from '@mantine/core';
import {type Image} from '@shopify/hydrogen/storefront-api-types';

export function HeroBackground({
  children,
  image,
  ...props
}: BoxComponentProps & {
  children: React.ReactNode;
  image?: Pick<Image, 'url'> | null;
}) {
  return (
    <Box
      bg={props.bg}
      style={{
        position: 'relative',
        marginTop: '-70px',
        paddingTop: '70px',
        borderBottomRightRadius: '40% 15%',
        borderBottomLeftRadius: '40% 15%',
      }}
    >
      <div
        style={
          image
            ? {
                position: 'absolute',
                left: 0,
                right: 0,
                bottom: 0,
                top: 0,
                borderBottomRightRadius: '40% 15%',
                borderBottomLeftRadius: '40% 15%',
                backgroundPosition: '50% 40%',
                backgroundRepeat: 'no-repeat',
                backgroundSize: '1000px',
                backgroundImage: `url('${image.url}')`,
              }
            : undefined
        }
      ></div>

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
