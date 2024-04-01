import {Container, Flex, Text, Title, rem} from '@mantine/core';
import {useMediaQuery} from '@mantine/hooks';
import type {PageComponentFragment} from 'storefrontapi.generated';
import {useField} from './utils';

export function SideBySide({component}: {component: PageComponentFragment}) {
  const isMobile = useMediaQuery('(max-width: 62em)');
  const field = useField(component);
  const title = field.getFieldValue('title');
  const text = field.getFieldValue('text');

  return (
    <Container size="md" my={rem(80)}>
      <Flex
        justify="space-between"
        align="center"
        style={{flexDirection: isMobile ? 'column' : 'row'}}
        gap="xl"
      >
        <Title fw={500} textWrap="wrap" style={{flex: 1}}>
          {title}
        </Title>
        <Text c="dimmed" size="lg" style={{flex: 1}}>
          {text}
        </Text>
      </Flex>
    </Container>
  );
}
