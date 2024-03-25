import {Carousel, type CarouselProps} from '@mantine/carousel';
import classes from './Slider.module.css';

export function Slider({children, ...props}: CarouselProps) {
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
