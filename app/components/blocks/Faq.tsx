import {Flex, Stack, Text, Title} from '@mantine/core';
import type {FaqFragment} from 'storefrontapi.generated';
import {Wrapper} from '../Wrapper';
import {AccordionMetaobject} from './AccordionMetaobject';
import classes from './Faq.module.css';

export function Faq({data}: {data: FaqFragment}) {
  const backgroundColor = data.backgroundColor?.value;
  const direction = data.direction
    ?.value as React.CSSProperties['flexDirection'];
  const title = data.title?.value;
  const description = data.description?.value;
  const accordion = data.accordion?.reference;

  return (
    <Wrapper bg={backgroundColor || undefined}>
      <Flex direction={{base: 'column', sm: direction || 'row'}} gap="xl">
        <Stack flex="1" justify="center" mb={{base: 'sm', sm: 0}}>
          {title && (
            <Title ta="center" className={classes.title}>
              {title}
            </Title>
          )}
          {description && (
            <Text ta="center" className={classes.description}>
              {description}
            </Text>
          )}
        </Stack>

        {accordion ? <AccordionMetaobject data={accordion} /> : null}
      </Flex>
    </Wrapper>
  );
}
