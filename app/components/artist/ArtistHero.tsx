import {
  ActionIcon,
  Avatar,
  Badge,
  Button,
  Flex,
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
  IconLogout,
} from '@tabler/icons-react';
import {type User} from '~/lib/api/model';

export function ArtistHero({artist}: {artist: User}) {
  const isMobile = useMediaQuery('(max-width: 62em)');

  const Tags = () => (
    <Stack gap="xs">
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
  );

  if (!artist) return null;
  return (
    <>
      <Grid columns={12} gutter={{base: 'sm', md: 'xl'}} grow>
        <Grid.Col span={{base: 'auto', md: 12}}>
          <Avatar
            src={artist.images?.profile?.url}
            size={isMobile ? 90 : 250}
            radius="100%"
          />
        </Grid.Col>
        <Grid.Col span={{base: 8, md: 12}}>
          <Flex
            gap={isMobile ? '0' : 'md'}
            direction="column"
            justify="center"
            h={isMobile ? '100%' : 'auto'}
          >
            <Title order={isMobile ? 2 : 1}>{artist.fullname}</Title>
            <Text fz={{base: 'md', md: 'lg'}}>
              {artist.aboutMe} <br />
            </Text>
            <Text fz={{base: 'md', md: 'lg'}}>
              {artist.yearsExperience} årserfaring
            </Text>
            <Stack gap="xs" visibleFrom="md">
              <Tags />
            </Stack>
          </Flex>
        </Grid.Col>
        <Grid.Col span={{base: 12}} hiddenFrom="md">
          <Tags />
        </Grid.Col>
        {Object.keys(artist.social).length > 0 ? (
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
        ) : null}
      </Grid>

      <Button
        variant="outline"
        color="black"
        size={'xl'}
        radius={'xl'}
        component={Link}
        to="/"
        pos="fixed"
        bottom={'var(--mantine-spacing-xl)'}
        visibleFrom="md"
      >
        <Group gap="xs">
          <IconLogout /> By Sisters
        </Group>
      </Button>

      <ActionIcon
        variant="outline"
        color="black"
        aria-label="Home"
        size="lg"
        radius="xl"
        pos="fixed"
        component={Link}
        to="/"
        top={'var(--mantine-spacing-sm)'}
        right={'var(--mantine-spacing-sm)'}
        hiddenFrom="md"
      >
        <IconLogout style={{width: '75%', height: '75%'}} stroke={1.5} />
      </ActionIcon>
    </>
  );
}
