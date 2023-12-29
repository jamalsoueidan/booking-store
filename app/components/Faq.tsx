import {Accordion, Text, Title} from '@mantine/core';
import {type PageComponentPageFragment} from 'storefrontapi.generated';
import classes from './Faq.module.css';
import {Wrapper} from './Wrapper';

export function Faq({
  title,
  description,
  pages,
}: {
  title?: string | null;
  description?: string | null;
  pages: Array<PageComponentPageFragment>;
}) {
  return (
    <Wrapper>
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
    </Wrapper>
  );
}
