import {Carousel, type CarouselProps} from '@mantine/carousel';

export function IndexCarousel({children, ...props}: CarouselProps) {
  return (
    <Carousel
      slideSize={{base: '75%', md: '25%'}}
      slideGap={'lg'}
      align="start"
      containScroll="trimSnaps"
      withControls={false}
      {...props}
    >
      {children}
    </Carousel>
  );
}
