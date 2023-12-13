import {
  ActionIcon,
  Avatar,
  Badge,
  Grid,
  Group,
  Stack,
  Text,
  Title,
  rem,
} from '@mantine/core';
import {useMediaQuery} from '@mantine/hooks';
import {Link} from '@remix-run/react';
import {
  IconBrandFacebook,
  IconBrandInstagram,
  IconBrandX,
  IconBrandYoutube,
} from '@tabler/icons-react';
import {type User} from '~/lib/api/model';

export function ArtistHero({artist}: {artist: User}) {
  const isMobile = useMediaQuery('(max-width: 62em)');

  if (!artist) return null;
  return (
    <Grid columns={12} gutter={{md: 'xl'}} m={isMobile ? 0 : 'xl'} grow>
      <Grid.Col span={{base: 'auto', md: 12}}>
        <Avatar
          src={artist.images?.profile?.url}
          size={isMobile ? 200 : 250}
          radius="100%"
        />
      </Grid.Col>
      <Grid.Col span={{base: 6, md: 12}}>
        <Stack gap={isMobile ? 'xs' : 'md'}>
          <Title order={isMobile ? 2 : 1} fw={500}>
            {artist.fullname}
          </Title>
          <Text c="dimmed" size={!isMobile ? rem(20) : undefined}>
            {artist.aboutMe} <br />
          </Text>
          <Text c="dimmed" size={!isMobile ? rem(20) : undefined}>
            {artist.yearsExperience} årserfaring
          </Text>
          <Stack gap="xs">
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
        </Stack>
      </Grid.Col>
      <Grid.Col span={{base: 'content', md: 12}}>
        <Group>
          {artist.social?.instagram && (
            <ActionIcon
              variant="filled"
              aria-label="Instgram"
              color="purple"
              size={rem(isMobile ? 50 : 80)}
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
              size={rem(isMobile ? 50 : 80)}
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
              size={rem(isMobile ? 50 : 80)}
              radius="md"
              component={Link}
              to={`https://x.com/${artist.social.x}`}
              target="_blank"
            >
              <IconBrandX
                style={{width: '100%', height: '100%'}}
                stroke={1.5}
              />
            </ActionIcon>
          )}
          {artist.social?.youtube && (
            <ActionIcon
              variant="filled"
              aria-label="Yotuube"
              color="red"
              size={rem(isMobile ? 50 : 80)}
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
        </Group>
      </Grid.Col>
    </Grid>
  );
}
