import {Avatar, Group, Text} from '@mantine/core';
import type {User} from '~/lib/api/model';
import classes from './TreatmentArtistCardComplete.module.css';

export const TreatmentArtistCardComplete = ({artist}: {artist: User}) => (
  <div>
    <Group wrap="nowrap" gap="xs">
      <Avatar src={artist.images?.profile?.url} radius={0} size={48} />
      <div style={{flex: 1}}>
        <Text fz="xs" tt="uppercase" fw={700} c="dimmed">
          {artist.username}
        </Text>

        <Text fz="lg" fw={500} className={classes.name}>
          {artist.fullname}
        </Text>
      </div>
    </Group>
  </div>
);
