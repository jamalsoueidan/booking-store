import {SimpleGrid, Stack, Text, ThemeIcon, Title, rem} from '@mantine/core';
import {IconHeart} from '@tabler/icons-react';
import {Wrapper} from '~/components/Wrapper';

export function Help() {
  return (
    <Wrapper bg="#f7f7f7">
      <Title ta="center" size={rem(60)} mb={rem(60)}>
        How it works for consumers
      </Title>
      <SimpleGrid cols={{base: 1, sm: 3}} spacing={{base: 'lg', sm: rem(50)}}>
        <Stack align="center" justify="center">
          <ThemeIcon
            variant="light"
            color="green"
            size={rem(200)}
            aria-label="Gradient action icon"
            radius="100%"
          >
            <IconHeart style={{width: '70%', height: '70%'}} />
          </ThemeIcon>
          <Title>Smart reminders</Title>
          <Text ta="center" size="xl" c="dimmed">
            You cant imagine how seamless your life can be
          </Text>
        </Stack>
        <Stack align="center" justify="center">
          <ThemeIcon
            variant="light"
            color="green"
            size={rem(200)}
            aria-label="Gradient action icon"
            radius="100%"
          >
            <IconHeart style={{width: '70%', height: '70%'}} />
          </ThemeIcon>
          <Title>Smart reminders</Title>
          <Text ta="center" size="xl" c="dimmed">
            You cant imagine how seamless your life can be
          </Text>
        </Stack>
        <Stack align="center" justify="center">
          <ThemeIcon
            variant="light"
            color="green"
            size={rem(200)}
            aria-label="Gradient action icon"
            radius="100%"
          >
            <IconHeart style={{width: '70%', height: '70%'}} />
          </ThemeIcon>
          <Title>Smart reminders</Title>
          <Text ta="center" size="xl" c="dimmed">
            You cant imagine how seamless your life can be
          </Text>
        </Stack>
      </SimpleGrid>
    </Wrapper>
  );
}
