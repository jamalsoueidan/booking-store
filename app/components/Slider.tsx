import {Carousel, type CarouselProps} from '@mantine/carousel';
import useEmblaCarousel from 'embla-carousel-react';
import classes from './Slider.module.css';

export function Slider({
  children,
  language,
  ...props
}: CarouselProps & {language: string}) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    direction: language === 'AR' ? 'rtl' : 'ltr',
  });

  return (
    <Carousel
      slideSize={{base: '50%', md: '25%'}}
      slideGap="lg"
      classNames={{viewport: classes.viewport}}
      withControls={false}
      align="start"
      containScroll="keepSnaps"
      ref={emblaRef}
      {...props}
    >
      {children}
    </Carousel>
  );
}
