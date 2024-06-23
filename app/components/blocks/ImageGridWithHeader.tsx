import {
  AspectRatio,
  Button,
  Container,
  Flex,
  Image,
  SimpleGrid,
  Stack,
  Text,
  Title,
  UnstyledButton,
  getGradient,
  rem,
  useMantineTheme,
} from '@mantine/core';
import {Link} from '@remix-run/react';
import {IconArrowRight} from '@tabler/icons-react';
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
  const fromColor = data.fromColor?.value;
  const toColor = data.toColor?.value;
  const button = data.button?.reference;
  const items = data.collections?.references?.nodes;

  return (
    <Wrapper
      bg={getGradient(
        {deg: 180, from: fromColor || 'white', to: toColor || 'white'},
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
              <UnstyledButton
                key={item.id}
                component={Link}
                to={`categories/${item.handle}`}
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
                  <Text>{item.description}</Text>
                </Stack>
              </UnstyledButton>
            );
          })}
        </SimpleGrid>
        {button ? (
          <Container size="xl">
            <Flex justify="center">
              <Button
                variant={button?.variant?.value || 'outline'}
                color={button?.color?.value || 'black'}
                size="lg"
                aria-label="Settings"
                component={Link}
                to={button.linkTo?.value || '/'}
                radius="lg"
                rightSection={
                  <IconArrowRight
                    style={{width: '70%', height: '70%'}}
                    stroke={1.5}
                  />
                }
              >
                {button?.text?.value}
              </Button>
            </Flex>
          </Container>
        ) : null}
      </Stack>
    </Wrapper>
  );
}
