import {
  Flex,
  getGradient,
  Accordion as MantineAcoordion,
  Stack,
  Text,
  useMantineTheme,
} from '@mantine/core';
import type {
  AccordionFragment,
  AccordionItemFragment,
} from 'storefrontapi.generated';
import {Wrapper} from '../Wrapper';

import {H2} from '../titles/H2';

export function Accordion({data}: {data: AccordionFragment}) {
  const theme = useMantineTheme();

  const backgroundColor = data.backgroundColor?.value || 'white';
  const fromColor = data.fromColor?.value;
  const toColor = data.toColor?.value;

  const direction = data.direction
    ?.value as React.CSSProperties['flexDirection'];
  const title = data.title?.value;
  const description = data.description?.value;

  const variant = data.variant?.value;
  const items = data.items?.references?.nodes;

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
      <Flex
        direction={{base: 'column', sm: direction || 'row'}}
        gap="xl"
        align="center"
      >
        <Stack flex=".5" justify="center" mb={{base: 'sm', sm: 0}}>
          {title && (
            <H2 gradients={{from: '#9030ed', to: '#e71b7c'}}>{title}</H2>
          )}
          {description && (
            <Text ta="center" fz={{base: 'md', sm: 'xl'}}>
              {description}
            </Text>
          )}
        </Stack>
        <Flex w={{base: '100%', sm: '60%'}} align="center">
          {items ? (
            <AccordionComponent variant={variant || 'filled'} items={items} />
          ) : null}
        </Flex>
      </Flex>
    </Wrapper>
  );
}

export function AccordionComponent({
  variant,
  items,
}: {
  variant: string;
  items: Array<AccordionItemFragment>;
}) {
  return (
    <MantineAcoordion variant={variant} flex="1">
      {items.map((item) => (
        <AccordionItemMetaobject key={item.id} item={item} />
      ))}
    </MantineAcoordion>
  );
}

export const AccordionItemMetaobject = ({
  item,
}: {
  item: AccordionItemFragment;
}) => {
  const label = item.label?.value;
  const text = item.text?.value;

  return (
    <MantineAcoordion.Item key={item.id} value={label || ''}>
      <MantineAcoordion.Control>
        <Text fz="md" fw={500}>
          {label}
        </Text>
      </MantineAcoordion.Control>
      <MantineAcoordion.Panel>
        <div
          dangerouslySetInnerHTML={{
            __html: text || '',
          }}
        />
      </MantineAcoordion.Panel>
    </MantineAcoordion.Item>
  );
};
