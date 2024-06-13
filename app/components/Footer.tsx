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
import type {FooterQuery, HeaderQuery} from 'storefrontapi.generated';
import {useTranslations} from '~/providers/Translation';
import {useRootLoaderData} from '~/root';
import classes from './Footer.module.css';
import logo from '/logo.avif';

export function Footer({
  menu,
  shop,
}: FooterQuery & {shop: HeaderQuery['shop']}) {
  const {t} = useTranslations();
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
                {t('footer_logo_text')}
              </Text>
            </Flex>
            <Flex
              align="center"
              direction={{base: 'column', sm: 'row'}}
              gap="lg"
            >
              <Button
                component={Link}
                to="/artists"
                size="sm"
                variant="outline"
                color="black"
              >
                {t('footer_left_button')}
              </Button>
              <Button
                component={Link}
                to="/pages/start-din-skoenhedskarriere"
                size="sm"
                variant="outline"
                color="black"
              >
                {t('footer_right_button')}
              </Button>
            </Flex>
          </Stack>

          <FooterMenu menu={menu} />

          <Stack gap="lg" w={{base: '100%', sm: '20%'}}>
            <Stack gap="xs">
              <Text className={classes.title}>Socialmedia</Text>
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
            <Stack gap="xs">
              <Text className={classes.title}>{t('footer_language')}</Text>
              <Group gap="4px" justify="flex-start">
                <ActionIcon
                  size="lg"
                  variant="transparent"
                  radius="xl"
                  component={Link}
                  to="https://www.bysisters.dk/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <DK style={{width: rem(24), height: rem(24)}} />
                </ActionIcon>
                <ActionIcon
                  size="lg"
                  variant="transparent"
                  radius="xl"
                  component={Link}
                  to="https://en.bysisters.dk/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <US style={{width: rem(24), height: rem(24)}} />
                </ActionIcon>
                <ActionIcon
                  size="lg"
                  variant="transparent"
                  radius="xl"
                  component={Link}
                  to="https://ar.bysisters.dk/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <AE style={{width: rem(24), height: rem(24)}} />
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
  const {t} = useTranslations();
  const {publicStoreDomain} = useRootLoaderData();

  return (
    <Stack align="flex-start" gap="xs" w={{base: '100%', sm: '20%'}}>
      <Text className={classes.title}>{t('footer_company')}</Text>
      {menu?.items
        .filter(({url}) => url !== null && url !== undefined)
        .map((item) => {
          const url = item.url?.includes(publicStoreDomain)
            ? new URL(item.url).pathname
            : item.url;
          return (
            <Anchor
              component={Link}
              to={url?.replace('/en/', '/') || ''}
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
