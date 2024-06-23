import {
  ActionIcon,
  Anchor,
  Button,
  Container,
  Flex,
  Group,
  Image,
  rem,
  Stack,
  Text,
} from '@mantine/core';
import {Link, NavLink} from '@remix-run/react';
import {IconBrandFacebook, IconBrandInstagram} from '@tabler/icons-react';
import {AE, DK, US} from 'country-flag-icons/react/3x2';
import {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import type {FooterQuery, HeaderQuery} from 'storefrontapi.generated';
import {useRootLoaderData} from '~/root';
import classes from './Footer.module.css';
import logo from '/logo.avif';

export function Footer({
  menu,
  shop,
}: FooterQuery & {shop: HeaderQuery['shop']}) {
  const {t} = useTranslation(['footer']);
  const [currentPath, setCurrentPath] = useState('');

  useEffect(() => {
    // Check if the window object is available (client-side rendering)
    if (typeof window !== 'undefined') {
      setCurrentPath(
        window.location.pathname +
          window.location.search +
          window.location.hash,
      );
    }
  }, []);

  const getNewUrl = (newDomain: string) => `${newDomain}${currentPath}`;

  return (
    <footer className={classes.footer}>
      <Container size="xl">
        <Flex direction={{base: 'column', sm: 'row'}} gap="xl">
          <Stack style={{flex: 1}} gap="xl">
            <Flex
              direction="column"
              align={{base: 'center', sm: 'flex-start'}}
              gap="sm"
            >
              <NavLink prefetch="intent" to="/">
                <Image src={logo} alt={shop.name} maw={200} />
              </NavLink>
              <Text size="md" c="dimmed" className={classes.description}>
                {t('logo_text')}
              </Text>
            </Flex>
            <Flex
              align="center"
              direction={{base: 'column', sm: 'row'}}
              gap="lg"
            >
              <Button
                component={Link}
                to="/users"
                size="sm"
                variant="outline"
                color="black"
              >
                {t('left_button')}
              </Button>
              <Button
                component={Link}
                to="/pages/start-din-skoenhedskarriere"
                size="sm"
                variant="outline"
                color="black"
              >
                {t('right_button')}
              </Button>
            </Flex>
          </Stack>

          <FooterMenu menu={menu} />

          <Stack gap="lg" w={{base: '100%', sm: '20%'}}>
            <Stack gap="xs">
              <Text className={classes.title}>{t('social_media')}</Text>
              <Group gap="xs" justify="flex-start">
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
            <Stack gap="0">
              <Text className={classes.title}>{t('language')}</Text>
              <Group gap="4px" justify="flex-start">
                <ActionIcon
                  size="xl"
                  variant="transparent"
                  component={Link}
                  to={getNewUrl('https://www.bysisters.dk')}
                >
                  <DK style={{width: rem(32), height: rem(32)}} />
                </ActionIcon>
                <ActionIcon
                  size="xl"
                  variant="transparent"
                  component={Link}
                  to={getNewUrl('https://en.bysisters.dk')}
                >
                  <US style={{width: rem(32), height: rem(32)}} />
                </ActionIcon>
                <ActionIcon
                  size="xl"
                  variant="transparent"
                  component={Link}
                  to={getNewUrl('https://ar.bysisters.dk')}
                >
                  <AE style={{width: rem(32), height: rem(32)}} />
                </ActionIcon>
              </Group>
            </Stack>
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
  const {t} = useTranslation(['footer']);
  const {publicStoreDomain} = useRootLoaderData();

  return (
    <Stack align="flex-start" gap="xs" w={{base: '100%', sm: '20%'}}>
      <Text className={classes.title}>{t('company')}</Text>
      {menu?.items
        .filter(({url}) => url !== null && url !== undefined)
        .map((item) => {
          const url = item.url?.includes(publicStoreDomain)
            ? new URL(item.url).pathname
            : item.url;
          return (
            <Anchor
              component={Link}
              to={url?.replace('/en/', '/').replace('/ar/', '/') || ''}
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
