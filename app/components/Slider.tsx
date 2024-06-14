import Autoplay from 'embla-carousel-autoplay';
import useEmblaCarousel from 'embla-carousel-react';
import {type PropsWithChildren} from 'react';
import classes from './Slider.module.css';

export function Slider({
  children,
  language,
}: PropsWithChildren & {language: string}) {
  const [emblaRef] = useEmblaCarousel(
    {
      loop: true,
      align: 'start',
      dragFree: true,
      direction: language === 'AR' ? 'rtl' : 'ltr',
    },
    [Autoplay()],
  );

  return (
    <section className={classes.embla} dir={language === 'AR' ? 'rtl' : 'ltr'}>
      <div className={classes.embla} ref={emblaRef}>
        <div className={classes.embla__container}>{children}</div>
      </div>
    </section>
  );
}

export function Slice({children}: PropsWithChildren) {
  return <div className={classes.embla__slide}>{children}</div>;
}
