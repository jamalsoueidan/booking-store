import {Carousel, type CarouselProps} from '@mantine/carousel';
import useEmblaCarousel from 'embla-carousel-react';
import {useState} from 'react';
import classes from './Slider.module.css';

export function Slider({
  children,
  language,
  ...props
}: CarouselProps & {language: string}) {
  const [options, setOptions] = useState({direction: 'rtl' as any});
  const [emblaRef, emblaApi] = useEmblaCarousel(options);

  return (
    <Carousel
      slideSize={{base: '50%', md: '25%'}}
      slideGap="lg"
      classNames={{viewport: classes.viewport}}
      withControls={false}
      align="start"
      containScroll="keepSnaps"
      {...props}
    >
      {children}
    </Carousel>
  );
}
