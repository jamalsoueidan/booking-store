import {Accordion, Text} from '@mantine/core';
import {type PageComponentMetaobjectFragment} from 'storefrontapi.generated';
import {useField} from './utils';

export function AccordionMetaobject({
  metaobject,
}: {
  metaobject: PageComponentMetaobjectFragment | null;
}) {
  const field = useField(metaobject);
  if (!metaobject) return null;
  const variant = field.getFieldValue('variant');
  const items = field.getItems('items');

  return <AccordionComponent variant={variant || 'separated'} items={items} />;
}

export type AccordionComponentProps = {
  variant: string;
  items: Array<PageComponentMetaobjectFragment>;
};

export function AccordionComponent({variant, items}: AccordionComponentProps) {
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
  item: PageComponentMetaobjectFragment;
}) => {
  const field = useField(item);
  const label = field.getFieldValue('label');
  const text = field.getFieldValue('text');

  return (
    <Accordion.Item key={item.id} value={label || ''}>
      <Accordion.Control>
        <Text fz="lg" fw={500}>
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
