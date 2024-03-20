import {Accordion, SimpleGrid, Stack, Text, Title} from '@mantine/core';
import type {PageComponentFragment} from 'storefrontapi.generated';
import {Wrapper} from '~/components/Wrapper';
import {useField} from '../metaobjects/utils';
import classes from './FaqQuestions.module.css';

export function FaqQuestions({faq}: {faq?: PageComponentFragment | null}) {
  const field = useField(faq);
  if (!faq) {
    return null;
  }

  const title = field.getFieldValue('title');
  const description = field.getFieldValue('description');
  const questions = field.getItems('items');

  return (
    <Wrapper bg="yellow.1" mb="0">
      <SimpleGrid cols={{base: 1, md: 2}} spacing="xl">
        <Stack>
          <Title order={1} fw={500} lts="1px">
            {title}
          </Title>
          <Text fw={400} size="lg">
            {description}
          </Text>
        </Stack>
        <Accordion variant="default" classNames={classes}>
          {questions?.map(({id, fields}) => (
            <Accordion.Item
              key={id}
              value={fields.find(({key}) => key === 'question')?.value || ''}
            >
              <Accordion.Control p={0}>
                <Text fz="lg" fw={500}>
                  {fields.find(({key}) => key === 'question')?.value || ''}
                </Text>
              </Accordion.Control>
              <Accordion.Panel>
                <div
                  dangerouslySetInnerHTML={{
                    __html:
                      fields.find(({key}) => key === 'answer')?.value || '',
                  }}
                />
              </Accordion.Panel>
            </Accordion.Item>
          ))}
        </Accordion>
      </SimpleGrid>
    </Wrapper>
  );
}
