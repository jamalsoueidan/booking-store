import {Flex, Stack, Text, Title} from '@mantine/core';
import {useMediaQuery} from '@mantine/hooks';
import type {
  PageComponentFragment,
  PageComponentMetaobjectFragment,
} from 'storefrontapi.generated';
import {Wrapper} from '../Wrapper';
import {AccordionMetaobject} from './AccordionMetaobject';
import classes from './Faq.module.css';
import {useField} from './utils';

export function Faq({
  component,
}: {
  component?: PageComponentFragment | PageComponentMetaobjectFragment | null;
}) {
  const isMobile = useMediaQuery('(max-width: 62em)');
  const field = useField(component);
  if (!component) return null;

  const backgroundColor = field.getFieldValue('background_color');
  const direction = field.getFieldValue('direction') as any;
  const title = field.getFieldValue('title');
  const description = field.getFieldValue('description');
  const accordion = field.getMetaObject('accordion');

  return (
    <Wrapper bg={backgroundColor || 'gray.1'}>
      <Flex direction={isMobile ? 'column' : direction || 'row'} gap="xl">
        <Stack flex="1" justify="center" mb={!isMobile ? '20px' : 0}>
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

        {accordion ? <AccordionMetaobject metaobject={accordion} /> : null}
      </Flex>
    </Wrapper>
  );
}
