import {Avatar, Button, Card, Flex, Stack, Text} from '@mantine/core';
import {Link} from '@remix-run/react';
import type {User} from '~/lib/api/model';

export const ArtistCard = ({artist}: {artist: User}) => (
  <Card
    radius="xl"
    withBorder
    p="lg"
    bg="var(--mantine-color-body)"
    component={Link}
    to={`/artist/${artist.username}`}
  >
    <Stack gap="md">
      <Avatar
        src={artist.images?.profile?.url}
        w="100%"
        radius="100%"
        h="auto"
      />
      <div>
        <Text ta="center" fz="lg" fw={500} c="black">
          {artist.fullname}
        </Text>
        <Text ta="center" c="dimmed" fz="sm">
          {artist.shortDescription}
        </Text>
      </div>

      <Flex justify="center">
        <Button variant="default" size="xs" radius="lg">
          Vis profile
        </Button>
      </Flex>
    </Stack>
  </Card>
);
