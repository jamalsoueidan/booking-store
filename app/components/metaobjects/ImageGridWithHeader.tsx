import {
  Anchor,
  AspectRatio,
  Image,
  SimpleGrid,
  Stack,
  Title,
  rem,
} from '@mantine/core';
import {Link} from '@remix-run/react';
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
      <Stack gap="xl">
        {title ? (
          <Title ta="center" fw={500} size={rem(48)} lts="1px">
            {title}
          </Title>
        ) : null}
        <SimpleGrid
          cols={{base: 2, sm: 3, md: 5}}
          spacing={{base: 'lg', sm: rem(50)}}
        >
          {items?.map((item) => (
            <Anchor
              key={item.id}
              component={Link}
              to={`categories/${item.handle}`}
              underline="hover"
            >
              <Stack>
                <AspectRatio>
                  <Image
                    src={item.image?.url || ''}
                    radius="xl"
                    fallbackSrc="https://placehold.co/400x600?text=Behandling"
                  />
                </AspectRatio>
                <Title
                  order={3}
                  c="black"
                  fw="500"
                  style={{textDecoration: 'none'}}
                >
                  {parseTE(item.title)}
                </Title>
              </Stack>
            </Anchor>
          ))}
        </SimpleGrid>
      </Stack>
    </Wrapper>
  );
}
