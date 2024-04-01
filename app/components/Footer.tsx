import {
  ActionIcon,
  Anchor,
  Button,
  Container,
  Flex,
  Group,
  rem,
  Stack,
  Text,
} from '@mantine/core';
import {useMediaQuery} from '@mantine/hooks';
import {Link, NavLink} from '@remix-run/react';
import {IconBrandFacebook, IconBrandInstagram} from '@tabler/icons-react';
import type {FooterQuery, HeaderQuery} from 'storefrontapi.generated';
import {useRootLoaderData} from '~/root';
import logo from '../../public/logo.avif';
import classes from './Footer.module.css';

export function Footer({
  menu,
  shop,
}: FooterQuery & {shop: HeaderQuery['shop']}) {
  const isMobile = useMediaQuery('(max-width: 62em)');

  return (
    <footer className={classes.footer}>
      <Container size="xl">
        <Flex direction={{base: 'column', sm: 'row'}} gap="xl">
          <Stack style={{flex: 1}} gap="xl">
            <Flex direction="column" align={isMobile ? 'center' : undefined}>
              <NavLink prefetch="intent" to="/">
                <img src={logo} alt={shop.name} className={classes.logo} />
              </NavLink>
              <Text size="md" c="dimmed" className={classes.description}>
                Vores platform forbinder dig med talentfulde eksperter inden for
                alle aspekter af skønhed.
              </Text>
            </Flex>
            <Flex
              align="center"
              direction={isMobile ? 'column' : 'row'}
              gap="lg"
            >
              <Button
                component={Link}
                to="/artists"
                size="sm"
                variant="outline"
                color="black"
              >
                Find en skønhedskarriere
              </Button>
              <Button
                component={Link}
                to="/pages/start-din-skoenhedskarriere"
                size="sm"
                variant="outline"
                color="black"
              >
                Start din skønhedskarriere
              </Button>
            </Flex>
          </Stack>

          <FooterMenu menu={menu} />

          <Stack gap="xs" w={{base: '100%', sm: '20%'}}>
            <Text className={classes.title}>Socialmedia</Text>
            <Group gap="lg" justify="flex-start">
              <ActionIcon
                size="lg"
                variant="default"
                radius="xl"
                component={Link}
                to="https://www.facebook.com/makeuphair.sisters/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <IconBrandFacebook
                  style={{width: rem(24), height: rem(24)}}
                  stroke={1.5}
                />
              </ActionIcon>
              <ActionIcon
                size="lg"
                variant="default"
                radius="xl"
                component={Link}
                to="https://www.instagram.com/__bysisters/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <IconBrandInstagram
                  style={{width: rem(24), height: rem(24)}}
                  stroke={1.5}
                />
              </ActionIcon>
            </Group>
          </Stack>
        </Flex>
        <Text c="dimmed" size="sm" mt="xl">
          © 2024 BySisters. All rights reserved.
        </Text>
      </Container>
    </footer>
  );
}

function FooterMenu({menu}: {menu: FooterQuery['menu']}) {
  const {publicStoreDomain} = useRootLoaderData();

  return (
    <Stack align="flex-start" gap="xs" w={{base: '100%', sm: '20%'}}>
      <Text className={classes.title}>Virksomhed</Text>
      {menu?.items
        .filter(({url}) => url !== null && url !== undefined)
        .map((item) => {
          const url = item.url?.includes(publicStoreDomain)
            ? new URL(item.url).pathname
            : item.url;
          return (
            <Anchor
              component={Link}
              to={url || ''}
              c="dimmed"
              size="sm"
              key={item.id}
            >
              {item.title}
            </Anchor>
          );
        })}
    </Stack>
  );
}
