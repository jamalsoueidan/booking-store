import {Accordion, Stack, Text, Title, rem} from '@mantine/core';
import {
  type PageComponentFragment,
  type PageComponentMetaobjectFragment,
} from 'storefrontapi.generated';
import {Wrapper} from '../Wrapper';
import classes from './Faq.module.css';
import {useField} from './utils';

export function Faq({component}: {component: PageComponentFragment}) {
  const field = useField(component);
  const bg = field.getFieldValue('background_color');
  const title = field.getFieldValue('title');
  const description = field.getFieldValue('description');
  const items = field.getItems('items');

  return (
    <Wrapper bg={bg || undefined}>
      <Stack>
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

      <Accordion variant="separated" mt={rem(50)}>
        {items.map((item) => (
          <FaqItem key={item.id} item={item} />
        ))}
      </Accordion>
    </Wrapper>
  );
}

const FaqItem = ({item}: {item: PageComponentMetaobjectFragment}) => {
  const field = useField(item);
  const question = field.getFieldValue('question');
  const answer = field.getFieldValue('answer');

  return (
    <Accordion.Item
      key={item.id}
      value={question || ''}
      className={classes.item}
    >
      <Accordion.Control>
        <Text fz="lg" fw={500}>
          {question}
        </Text>
      </Accordion.Control>
      <Accordion.Panel>
        <div
          dangerouslySetInnerHTML={{
            __html: answer || '',
          }}
        />
      </Accordion.Panel>
    </Accordion.Item>
  );
};
