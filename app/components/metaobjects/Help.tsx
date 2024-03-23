import {SimpleGrid, Stack, Text, Title, rem} from '@mantine/core';
import {
  IconBasket,
  IconBeach,
  IconHeart,
  IconSearch,
} from '@tabler/icons-react';
import type {
  PageComponentFragment,
  PageComponentMetaobjectFragment,
} from 'storefrontapi.generated';
import {Wrapper} from '../Wrapper';
import {ThemeIconMetaobject} from './ThemeIconMetaobject';
import {useField} from './utils';

export function Help({component}: {component: PageComponentFragment}) {
  const field = useField(component);
  const title = field.getFieldValue('title');
  const backgroundColor = field.getFieldValue('background_color');
  const items = field.getItems('items');

  return (
    <Wrapper bg={backgroundColor || undefined}>
      {title ? (
        <Title ta="center" fw={500} size={rem(48)}>
          {title}
        </Title>
      ) : null}
      <SimpleGrid cols={{base: 1, sm: 3}} spacing={{base: 'lg', sm: rem(50)}}>
        {items?.map((item) => (
          <HelpItem key={item.id} item={item} />
        ))}
      </SimpleGrid>
    </Wrapper>
  );
}

const icons: Record<string, any> = {
  beach: IconBeach,
  search: IconSearch,
  basket: IconBasket,
  '': IconHeart,
};

const HelpItem = ({item}: {item: PageComponentMetaobjectFragment}) => {
  const field = useField(item);
  const title = field.getFieldValue('title');
  const description = field.getFieldValue('description');
  const backgroundColor = field.getFieldValue('background_color');
  const themeIcon = field.getMetaObject('theme_icon');

  return (
    <Stack
      key={item.id}
      align="center"
      justify="flex-start"
      bg={backgroundColor}
      p="xl"
    >
      {themeIcon ? <ThemeIconMetaobject metaobject={themeIcon} /> : null}
      <Title size={rem(28)} ta="center" fw={400}>
        {title}
      </Title>
      <Text ta="center" size="lg" c="dimmed">
        {description}
      </Text>
    </Stack>
  );
};
