import {
  Box,
  Flex,
  getGradient,
  Stack,
  Text,
  Title,
  useMantineTheme,
} from '@mantine/core';
import type {FaqFragment} from 'storefrontapi.generated';
import {Wrapper} from '../Wrapper';
import {AccordionMetaobject} from './AccordionMetaobject';
import classes from './Faq.module.css';

export function Faq({data}: {data: FaqFragment}) {
  const theme = useMantineTheme();

  const backgroundColor = data.backgroundColor?.value || 'white';
  const fromColor = data.fromColor?.value;
  const toColor = data.toColor?.value;

  const direction = data.direction
    ?.value as React.CSSProperties['flexDirection'];
  const title = data.title?.value;
  const description = data.description?.value;
  const accordion = data.accordion?.reference;

  return (
    <Wrapper
      bg={
        fromColor
          ? getGradient(
              {
                deg: 180,
                from: fromColor,
                to: toColor || 'white',
              },
              theme,
            )
          : backgroundColor
      }
    >
      <Flex direction={{base: 'column', sm: direction || 'row'}} gap="xl">
        <Stack flex=".5" justify="center" mb={{base: 'sm', sm: 0}}>
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
        <Box flex="1">
          {accordion ? <AccordionMetaobject data={accordion} /> : null}
        </Box>
      </Flex>
    </Wrapper>
  );
}
