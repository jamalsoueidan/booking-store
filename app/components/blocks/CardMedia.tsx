import {Container, Flex, Image, Stack, Text, Title, rem} from '@mantine/core';
import {useMediaQuery} from '@mantine/hooks';
import type {PageComponentFragment} from 'storefrontapi.generated';
import {useField} from './utils';

export function CardMedia({component}: {component: PageComponentFragment}) {
  const isMobile = useMediaQuery('(max-width: 62em)');
  const field = useField(component);

  const title = field.getFieldValue('title');
  const description = field.getFieldValue('description');

  const image = field.getImage('image');
  const flip = !isMobile && field.getBooleanValue('flip');

  return (
    <Container size="md" my={rem(80)}>
      <Flex
        justify="space-between"
        gap={{base: 'lg', sm: rem(120)}}
        style={{flexDirection: isMobile ? 'column' : 'row'}}
      >
        <Stack style={{order: flip ? 2 : 1, flex: 1}} gap="lg">
          <Title fw={500}>{title}</Title>
          <Text c="dimmed" size="lg">
            {description}
          </Text>
        </Stack>
        <Image
          src={image?.url}
          height={200}
          w="auto"
          radius="xl"
          style={{order: flip ? 1 : 2, flex: 1}}
        />
      </Flex>
    </Container>
  );
}
