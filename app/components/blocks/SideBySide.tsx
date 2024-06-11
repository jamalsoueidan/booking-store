import {Container, Flex, Text, Title, rem} from '@mantine/core';
import {type SideBySideFragment} from 'storefrontapi.generated';

export function SideBySide({component}: {component: SideBySideFragment}) {
  const title = component.title?.value;
  const text = component.text?.value;

  return (
    <Container size="md" my={rem(80)}>
      <Flex
        direction={{base: 'column', sm: 'row'}}
        justify="space-between"
        align="center"
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
