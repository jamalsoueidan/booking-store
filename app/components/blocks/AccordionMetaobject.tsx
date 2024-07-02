import {Accordion, Text} from '@mantine/core';
import type {
  AccordionFragment,
  AccordionItemFragment,
} from 'storefrontapi.generated';

export function AccordionMetaobject({data}: {data: AccordionFragment}) {
  const variant = data.variant?.value;
  const items = data.items?.references?.nodes;
  if (!items) {
    return null;
  }

  return <AccordionComponent variant={variant || 'separated'} items={items} />;
}

export function AccordionComponent({
  variant,
  items,
}: {
  variant: string;
  items: Array<AccordionItemFragment>;
}) {
  return (
    <Accordion variant={variant || 'separated'} flex="1">
      {items.map((item) => (
        <AccordionItemMetaobject key={item.id} item={item} />
      ))}
    </Accordion>
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
    <Accordion.Item key={item.id} value={label || ''}>
      <Accordion.Control>
        <Text fz="md" fw={500}>
          {label}
        </Text>
      </Accordion.Control>
      <Accordion.Panel>
        <div
          dangerouslySetInnerHTML={{
            __html: text || '',
          }}
        />
      </Accordion.Panel>
    </Accordion.Item>
  );
};
