import {Avatar, Group, Stack, Text, Title} from '@mantine/core';
import {type User} from '~/lib/api/model';

export function ArtistHero({artist}: {artist: User}) {
  if (!artist) return null;
  return (
    <Group mb="xl">
      <Avatar src={artist.images?.profile?.url} size={150} radius={150} />
      <Stack gap="xs">
        <Title order={2} fw={500}>
          {artist.fullname}
        </Title>
        <Text c="dimmed">{artist.aboutMe}</Text>
      </Stack>
    </Group>
  );
}
