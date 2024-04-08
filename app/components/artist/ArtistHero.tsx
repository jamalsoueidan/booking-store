import {
  ActionIcon,
  Avatar,
  Button,
  Flex,
  Grid,
  Group,
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
import {useUser} from '~/hooks/use-user';

export const ArtistHero = () => {
  const user = useUser();
  const isMobile = useMediaQuery('(max-width: 62em)');

  return (
    <>
      <Grid columns={12} gutter={{base: 'sm', md: 'xl'}} grow>
        <Grid.Col span={{base: 'auto', md: 12}}>
          <Avatar
            src={user.images?.profile?.url}
            size={isMobile ? 90 : 250}
            radius="100%"
          />
        </Grid.Col>
        <Grid.Col span={{base: 8, md: 12}}>
          <Flex
            gap={{base: '0', md: 'md'}}
            direction="column"
            justify="center"
            h={isMobile ? '100%' : 'auto'}
          >
            <Title order={isMobile ? 2 : 1}>{user.fullname}</Title>
            <Text fz={{base: 'md', md: 'lg'}}>
              {user.shortDescription} <br />
            </Text>
          </Flex>
        </Grid.Col>
        {Object.keys(user.social).length > 0 ? (
          <Grid.Col span={{base: 'content', md: 12}}>
            <Group>
              {user.social?.instagram && (
                <ActionIcon
                  variant="filled"
                  aria-label="Instgram"
                  color="purple"
                  size={rem(isMobile ? 50 : 80)}
                  radius="md"
                  component={Link}
                  to={`https://www.instagram.com/${user.social.instagram}`}
                  target="_blank"
                >
                  <IconBrandInstagram
                    style={{width: '100%', height: '100%'}}
                    stroke={1.5}
                  />
                </ActionIcon>
              )}
              {user.social?.facebook && (
                <ActionIcon
                  variant="filled"
                  aria-label="Instgram"
                  color="blue"
                  size={rem(isMobile ? 50 : 80)}
                  radius="md"
                  component={Link}
                  to={`https://www.facebook.com/${user.social.instagram}`}
                  target="_blank"
                >
                  <IconBrandFacebook
                    style={{width: '100%', height: '100%'}}
                    stroke={1.5}
                  />
                </ActionIcon>
              )}
              {user.social?.x && (
                <ActionIcon
                  variant="filled"
                  aria-label="X"
                  color="black"
                  size={rem(isMobile ? 50 : 80)}
                  radius="md"
                  component={Link}
                  to={`https://x.com/${user.social.x}`}
                  target="_blank"
                >
                  <IconBrandX
                    style={{width: '100%', height: '100%'}}
                    stroke={1.5}
                  />
                </ActionIcon>
              )}
              {user.social?.youtube && (
                <ActionIcon
                  variant="filled"
                  aria-label="Yotuube"
                  color="red"
                  size={rem(isMobile ? 50 : 80)}
                  radius="md"
                  component={Link}
                  to={`https://youtube.com/${user.social.youtube}`}
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
};
