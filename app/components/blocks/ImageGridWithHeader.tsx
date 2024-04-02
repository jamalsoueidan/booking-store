import {
  Anchor,
  AspectRatio,
  Image,
  SimpleGrid,
  Stack,
  Title,
  getGradient,
  rem,
  useMantineTheme,
} from '@mantine/core';
import {Link} from '@remix-run/react';
import type {
  PageComponentCollectionFragment,
  PageComponentFragment,
} from 'storefrontapi.generated';
import {parseTE} from '~/lib/clean';
import {Wrapper} from '../Wrapper';
import {TransformText} from './TransformText';
import {useField} from './utils';

export function ImageGridWithHeader({
  component,
}: {
  component: PageComponentFragment;
}) {
  const theme = useMantineTheme();
  const field = useField(component);
  const title = field.getFieldValue('title');
  const backgroundColor = field.getFieldValue('background_color');
  const items = field.getItems<PageComponentCollectionFragment>('collections');

  return (
    <Wrapper
      bg={getGradient(
        {deg: 180, from: 'pink.1', to: backgroundColor || 'white'},
        theme,
      )}
    >
      <Stack gap="xl">
        {title ? (
          <TransformText input={title} fz={{base: rem(35), sm: rem(45)}} />
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
