import {
  Card,
  Container,
  Flex,
  Image,
  Stack,
  Text,
  Title,
  rem,
} from '@mantine/core';
import type {CardMediaFragment} from 'storefrontapi.generated';

export function CardMedia({component}: {component: CardMediaFragment}) {
  const title = component.title?.value;
  const description = component.description?.value;

  const image = component.image?.reference?.image;
  const flip = component.flip?.value === 'true';

  return (
    <Container size="md" my={rem(80)}>
      <Card withBorder p="lg" radius="lg">
        <Flex
          justify="space-between"
          gap={{base: 'lg', sm: rem(120)}}
          direction={{base: 'column', sm: 'row'}}
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
      </Card>
    </Container>
  );
}
