import {Avatar, Group, Text} from '@mantine/core';
import type {User} from '~/lib/api/model';

export const TreatmentArtistCardComplete = ({artist}: {artist: User}) => (
  <div>
    <Group wrap="nowrap" gap="xs">
      <div style={{flex: 1}}>
        <Text size="md" c="dimmed" fw="500">
          Du mødes med:
        </Text>
        <Text size="xl" fw="bold">
          {artist.fullname}
        </Text>
      </div>
      <Avatar src={artist.images?.profile?.url} radius={0} size={64} />
    </Group>
  </div>
);
