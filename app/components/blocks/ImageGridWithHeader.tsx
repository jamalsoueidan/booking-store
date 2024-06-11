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
import type {ImageGridWithHeaderFragment} from 'storefrontapi.generated';
import {H2} from '../titles/H2';
import {Wrapper} from '../Wrapper';

export function ImageGridWithHeader({
  data,
}: {
  data: ImageGridWithHeaderFragment;
}) {
  const theme = useMantineTheme();
  const title = data.title?.value;
  const backgroundColor = data.backgroundColor?.value;
  const items = data.collections?.references?.nodes;

  return (
    <Wrapper
      bg={getGradient(
        {deg: 180, from: 'pink.1', to: backgroundColor || 'white'},
        theme,
      )}
    >
      <Stack gap="xl">
        {title ? (
          <H2 gradients={{from: '#9030ed', to: '#e71b7c'}}>{title}</H2>
        ) : null}
        <SimpleGrid
          cols={{base: 2, sm: 3, md: 5}}
          spacing={{base: 'lg', sm: rem(50)}}
        >
          {items?.map((item) => {
            const title = `https://placehold.co/400x600?text=${item.title}`;

            return (
              <Anchor
                key={item.id}
                component={Link}
                to={`categories/${item.handle}`}
                underline="hover"
              >
                <Stack>
                  <AspectRatio>
                    <Image
                      src={item.image?.url}
                      radius="xl"
                      fallbackSrc={`${title}`}
                      loading="lazy"
                    />
                  </AspectRatio>

                  <Title
                    order={3}
                    c="black"
                    fw="500"
                    style={{textDecoration: 'none'}}
                  >
                    {item.title}
                  </Title>
                </Stack>
              </Anchor>
            );
          })}
        </SimpleGrid>
      </Stack>
    </Wrapper>
  );
}
