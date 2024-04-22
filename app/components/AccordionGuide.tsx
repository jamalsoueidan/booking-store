import {Accordion, type AccordionProps} from '@mantine/core';
import classes from './AccordionGuide.module.css';

export function AccordionGuide({children, ...props}: AccordionProps) {
  return (
    <Accordion classNames={classes} {...props}>
      {children}
    </Accordion>
  );
}
