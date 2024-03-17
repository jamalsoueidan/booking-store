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
          {pages?.references?.nodes.map((page) => (
            <Accordion.Item key={page.id} value={page.title}>
              <Accordion.Control p={0}>
                <Text fz="lg" fw={500}>
                  {page.title}
                </Text>
              </Accordion.Control>
              <Accordion.Panel>
                <div dangerouslySetInnerHTML={{__html: page.body}} />
              </Accordion.Panel>
            </Accordion.Item>
          ))}
        </Accordion>
      </SimpleGrid>
    </Wrapper>
  );
}
