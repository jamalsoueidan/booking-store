import {
  ActionIcon,
  Avatar,
  Badge,
  Flex,
  Group,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import {Link} from '@remix-run/react';
import {
  IconBrandFacebook,
  IconBrandInstagram,
  IconBrandX,
  IconBrandYoutube,
} from '@tabler/icons-react';
import {type User} from '~/lib/api/model';

export function ArtistHero({artist}: {artist: User}) {
  if (!artist) return null;
  return (
    <Flex mb="xl" align={'center'} gap="md">
      <Avatar src={artist.images?.profile?.url} size={150} radius={150} />
      <Stack gap="xs">
        <div>
          <Title order={2} fw={500}>
            {artist.fullname}
          </Title>
          <Text c="dimmed">
            {artist.aboutMe} <br />
            Årserfaring: {artist.yearsExperience}
          </Text>
        </div>
        <Group gap="xs">
          {artist.professions.map((p) => (
            <Badge key={p} variant="outline" color="blue">
              {p}
            </Badge>
          ))}
        </Group>
        <Group gap="xs">
          {artist.specialties.map((p) => (
            <Badge key={p} variant="outline" color="gray">
              {p}
            </Badge>
          ))}
        </Group>
      </Stack>
      <Flex justify="flex-end" gap="md" style={{flexGrow: 1}} mr="xl">
        {artist.social?.instagram && (
          <ActionIcon
            variant="filled"
            aria-label="Instgram"
            color="purple"
            size="xl"
            radius="md"
            component={Link}
            to={`https://www.instagram.com/${artist.social.instagram}`}
            target="_blank"
          >
            <IconBrandInstagram
              style={{width: '100%', height: '100%'}}
              stroke={1.5}
            />
          </ActionIcon>
        )}
        {artist.social?.facebook && (
          <ActionIcon
            variant="filled"
            aria-label="Instgram"
            color="blue"
            size="xl"
            radius="md"
            component={Link}
            to={`https://www.facebook.com/${artist.social.instagram}`}
            target="_blank"
          >
            <IconBrandFacebook
              style={{width: '100%', height: '100%'}}
              stroke={1.5}
            />
          </ActionIcon>
        )}
        {artist.social?.x && (
          <ActionIcon
            variant="filled"
            aria-label="X"
            color="black"
            size="xl"
            radius="md"
            component={Link}
            to={`https://x.com/${artist.social.x}`}
            target="_blank"
          >
            <IconBrandX style={{width: '100%', height: '100%'}} stroke={1.5} />
          </ActionIcon>
        )}
        {artist.social?.youtube && (
          <ActionIcon
            variant="filled"
            aria-label="Yotuube"
            color="red"
            size="xl"
            radius="md"
            component={Link}
            to={`https://youtube.com/${artist.social.youtube}`}
            target="_blank"
          >
            <IconBrandYoutube
              style={{width: '90%', height: '100%'}}
              stroke={1.5}
            />
          </ActionIcon>
        )}
      </Flex>
    </Flex>
  );
}
