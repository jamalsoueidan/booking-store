import {SimpleGrid, Stack, Text, ThemeIcon, Title, rem} from '@mantine/core';
import {IconHeart} from '@tabler/icons-react';
import type {
  PageComponentFragment,
  PageComponentMetaobjectFragment,
} from 'storefrontapi.generated';
import {Wrapper} from '../Wrapper';
import {useField} from './utils';

export function Help({component}: {component: PageComponentFragment}) {
  const field = useField(component);
  const title = field.getFieldValue('title');
  const backgroundColor = field.getFieldValue('background_color');
  const items = field.getItems('items');

  return (
    <Wrapper bg={backgroundColor || undefined}>
      <Title ta="center" fw={500} size={rem(48)} mb={rem(60)}>
        {title}
      </Title>
      <SimpleGrid cols={{base: 1, sm: 3}} spacing={{base: 'lg', sm: rem(50)}}>
        {items?.map((item) => (
          <HelpItem key={item.id} item={item} />
        ))}
      </SimpleGrid>
    </Wrapper>
  );
}

const HelpItem = ({item}: {item: PageComponentMetaobjectFragment}) => {
  const field = useField(item);
  const title = field.getFieldValue('title');
  const description = field.getFieldValue('description');
  const color = field.getFieldValue('color');

  return (
    <Stack key={item.id} align="center" justify="flex-start">
      <ThemeIcon
        variant="light"
        color={color || 'green'}
        size={rem(200)}
        aria-label="Gradient action icon"
        radius="100%"
      >
        <IconHeart style={{width: '70%', height: '70%'}} />
      </ThemeIcon>
      <Title size={rem(28)} ta="center" fw={400}>
        {title}
      </Title>
      <Text ta="center" size="lg" c="dimmed">
        {description}
      </Text>
    </Stack>
  );
};
