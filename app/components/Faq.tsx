import {Accordion, Container, Text, Title} from '@mantine/core';
import {type PageComponentPageFragment} from 'storefrontapi.generated';
import classes from './Faq.module.css';

export function Faq({
  title,
  description,
  pages,
}: {
  title: string;
  description: string;
  pages: Array<PageComponentPageFragment>;
}) {
  return (
    <Container size="sm" className={classes.wrapper}>
      <Title ta="center" className={classes.title}>
        {title}
      </Title>
      <Text ta="center" className={classes.description}>
        {description}
      </Text>

      <Accordion variant="separated">
        {pages.map((page) => (
          <Accordion.Item
            key={page.id}
            value={page.title}
            className={classes.item}
          >
            <Accordion.Control>
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
    </Container>
  );
}
