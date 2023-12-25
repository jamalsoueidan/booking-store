import {Carousel, type CarouselProps} from '@mantine/carousel';
import classes from './Slider.module.css';

export function Slider({children, ...props}: CarouselProps) {
  return (
    <Carousel
      slideSize={{base: '100%', md: '25%'}}
      slideGap="lg"
      align="start"
      withControls={false}
      containScroll="keepSnaps"
      classNames={{viewport: classes.viewport}}
      {...props}
    >
      {children}
    </Carousel>
  );
}
