import {Carousel, type CarouselProps} from '@mantine/carousel';
import classes from './Slider.module.css';

export function Slider({children, ...props}: CarouselProps) {
  return (
    <Carousel
      dragFree
      slideSize={{base: '100%', md: '25%'}}
      slideGap="lg"
      classNames={{viewport: classes.viewport}}
      withControls={false}
      align="start"
      {...props}
    >
      {children}
    </Carousel>
  );
}
