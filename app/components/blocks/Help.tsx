import {SimpleGrid, Stack, Text, Title, rem} from '@mantine/core';
import {
  IconBasket,
  IconBeach,
  IconHeart,
  IconSearch,
} from '@tabler/icons-react';
import type {HelpFragment, HelpItemFragment} from 'storefrontapi.generated';
import {Wrapper} from '../Wrapper';
import {ThemeIconMetaobject} from './ThemeIconMetaobject';

export function Help({component}: {component: HelpFragment}) {
  const title = component.title?.value;
  const backgroundColor = component.backgroundColor?.value;
  const items = component.items?.references?.nodes;

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

const HelpItem = ({item}: {item: HelpItemFragment}) => {
  const title = item.title?.value;
  const description = item.description?.value;
  const backgroundColor = item.backgroundColor?.value;
  const themeIcon = item.themeIcon?.reference;

  return (
    <Stack
      key={item.id}
      align="center"
      justify="flex-start"
      bg={backgroundColor || undefined}
      p="xl"
    >
      {themeIcon ? <ThemeIconMetaobject data={themeIcon} /> : null}
      <Title size={rem(28)} ta="center" fw={400}>
        {title}
      </Title>
      <Text ta="center" size="lg" c="dimmed">
        {description}
      </Text>
    </Stack>
  );
};
