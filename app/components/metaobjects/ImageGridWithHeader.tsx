import {Image, SimpleGrid, Stack, Title, rem} from '@mantine/core';
import {Image as ShopifyImage} from '@shopify/hydrogen';
import type {
  PageComponentCollectionFragment,
  PageComponentFragment,
} from 'storefrontapi.generated';
import {parseTE} from '~/lib/clean';
import {Wrapper} from '../Wrapper';
import {useField} from './utils';

export function ImageGridWithHeader({
  component,
}: {
  component: PageComponentFragment;
}) {
  const field = useField(component);
  const title = field.getFieldValue('title');
  const backgroundColor = field.getFieldValue('background_color');
  const items = field.getItems<PageComponentCollectionFragment>('collections');

  return (
    <Wrapper bg={backgroundColor || undefined}>
      <Stack gap="60">
        {title ? (
          <Title ta="center" fw={500} size={rem(48)}>
            {title}
          </Title>
        ) : null}
        <SimpleGrid cols={{base: 2, sm: 5}} spacing={{base: 'lg', sm: rem(50)}}>
          {items?.map((item) => (
            <Stack key={item.id}>
              <Image
                src={item.image?.url || ''}
                component={ShopifyImage}
                aspectRatio="1"
                radius="xl"
                fallbackSrc="https://placehold.co/400x600?text=Behandling"
              />
              <Title order={3}>{parseTE(item.title)}</Title>
            </Stack>
          ))}
        </SimpleGrid>
      </Stack>
    </Wrapper>
  );
}
