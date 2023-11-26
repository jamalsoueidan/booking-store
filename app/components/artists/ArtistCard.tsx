import {Avatar, Button, Paper, Text} from '@mantine/core';
import {Link} from '@remix-run/react';
import type {User} from '~/lib/api/model';

export const ArtistCard = ({artist}: {artist: User}) => (
  <Paper
    radius="md"
    withBorder
    p="lg"
    bg="var(--mantine-color-body)"
    component={Link}
    to={`/artist/${artist.username}`}
  >
    <Avatar
      src={artist.images?.profile?.url}
      size={240}
      radius={240}
      mx="auto"
    />
    <Text ta="center" fz="lg" fw={500} mt="md" c="black">
      {artist.fullname}
    </Text>
    <Text ta="center" c="dimmed" fz="sm">
      {artist.shortDescription}
    </Text>

    <Button variant="default" fullWidth mt="md">
      Vis profile
    </Button>
  </Paper>
);
