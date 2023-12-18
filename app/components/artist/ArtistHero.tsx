import {
  ActionIcon,
  Avatar,
  Badge,
  Box,
  Button,
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
  IconHome,
} from '@tabler/icons-react';
import {type User} from '~/lib/api/model';

export function ArtistHero({artist}: {artist: User}) {
  const isMobile = useMediaQuery('(max-width: 62em)');

  if (!artist) return null;
  return (
    <Grid columns={12} gutter={{base: 'sm', md: 'xl'}} grow>
      <Grid.Col span={{base: 'auto', md: 12}}>
        <Avatar
          src={artist.images?.profile?.url}
          size={isMobile ? 140 : 250}
          radius="100%"
        />
      </Grid.Col>
      <Grid.Col span={{base: 6, md: 12}}>
        <Stack gap={isMobile ? 'xs' : 'md'}>
          <Title order={isMobile ? 2 : 1}>{artist.fullname}</Title>
          <Text size={!isMobile ? rem(18) : undefined}>
            {artist.aboutMe} <br />
          </Text>
          <Text size={!isMobile ? rem(18) : undefined}>
            {artist.yearsExperience} årserfaring
          </Text>
          <Stack gap="xs" visibleFrom="md">
            <Group gap="xs">
              {artist.professions.map((p) => (
                <Badge key={p} variant="outline" color="white">
                  {p}
                </Badge>
              ))}
            </Group>
            <Group gap="xs">
              {artist.specialties.map((p) => (
                <Badge key={p} variant="outline" color="white">
                  {p}
                </Badge>
              ))}
            </Group>
          </Stack>
        </Stack>
      </Grid.Col>
      <Grid.Col span={{base: 12}} hiddenFrom="md">
        <Stack gap="xs" mt="md">
          <Group gap="xs">
            {artist.professions.map((p) => (
              <Badge key={p} variant="outline" color="white">
                {p}
              </Badge>
            ))}
          </Group>
          <Group gap="xs">
            {artist.specialties.map((p) => (
              <Badge key={p} variant="outline" color="white">
                {p}
              </Badge>
            ))}
          </Group>
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
        <Box pos="fixed" bottom="var(--mantine-spacing-xl)">
          <Button
            variant="outline"
            color="black"
            size="xl"
            radius="lg"
            component={Link}
            to="/"
          >
            <Group gap="xs">
              <IconHome /> By Sisters
            </Group>
          </Button>
        </Box>
      </Grid.Col>
    </Grid>
  );
}
