import {Carousel, type CarouselProps} from '@mantine/carousel';
import useEmblaCarousel from 'embla-carousel-react/components';
import classes from './Slider.module.css';

export function Slider({
  children,
  language,
  ...props
}: CarouselProps & {language: string}) {
  useEmblaCarousel.globalOptions = {
    direction: language === 'AR' ? 'rtl' : 'ltr',
  };

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
