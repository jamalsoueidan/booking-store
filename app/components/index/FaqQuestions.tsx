import {Accordion, SimpleGrid, Stack, Text, Title} from '@mantine/core';
import type {FaqFragment} from 'storefrontapi.generated';
import {Wrapper} from '~/components/Wrapper';
import classes from './FaqQuestions.module.css';

export function FaqQuestions({faq}: {faq?: FaqFragment | null}) {
  if (!faq) {
    return null;
  }

  const title = faq.fields.find((p) => p.key === 'title')?.value || '';
  const description =
    faq.fields.find((p) => p.key === 'description')?.value || '';
  const pages = faq.fields.find((p) => p.key === 'pages');
  const questions = faq.fields.find((p) => p.key === 'questions')?.references
    ?.nodes;

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
