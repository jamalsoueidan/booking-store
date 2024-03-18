import {Accordion, Stack, Text, Title, rem} from '@mantine/core';
import {type PageComponentMetaobjectFragment} from 'storefrontapi.generated';
import classes from './Faq.module.css';

export function Faq({
  title,
  description,
  questions,
}: {
  title?: string | null;
  description?: string | null;
  questions: Array<PageComponentMetaobjectFragment>;
}) {
  return (
    <>
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
        {questions.map(({id, fields}) => (
          <Accordion.Item
            key={id}
            value={fields.find(({key}) => key === 'question')?.value || ''}
            className={classes.item}
          >
            <Accordion.Control>
              <Text fz="lg" fw={500}>
                {fields.find(({key}) => key === 'question')?.value || ''}
              </Text>
            </Accordion.Control>
            <Accordion.Panel>
              <div
                dangerouslySetInnerHTML={{
                  __html: fields.find(({key}) => key === 'answer')?.value || '',
                }}
              />
            </Accordion.Panel>
          </Accordion.Item>
        ))}
      </Accordion>
    </>
  );
}
