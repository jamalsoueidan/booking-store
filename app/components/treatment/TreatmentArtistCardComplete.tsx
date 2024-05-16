import {Avatar, Group, Text} from '@mantine/core';
import {type UserFragment} from 'storefrontapi.generated';
import {useUserMetaobject} from '~/hooks/useUserMetaobject';

export const TreatmentArtistCardComplete = ({
  user,
}: {
  user?: UserFragment | undefined | null;
}) => {
  const {fullname, image} = useUserMetaobject(user);

  return (
    <div>
      <Group wrap="nowrap" gap="xs">
        <div style={{flex: 1}}>
          <Text size="md" c="dimmed" fw="500">
            Du mødes med:
          </Text>
          <Text size="xl" fw="bold">
            {fullname}
          </Text>
        </div>
        <Avatar src={image.image?.url} radius={0} size={64} />
      </Group>
    </div>
  );
};
