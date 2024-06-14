import {
  json,
  type LoaderFunctionArgs,
  type MetaFunction,
} from '@shopify/remix-oxygen';

import {
  Alert,
  Avatar,
  Badge,
  Card,
  Container,
  Flex,
  Grid,
  Group,
  rem,
  Spoiler,
  Stack,
  Text,
  Title,
  UnstyledButton,
} from '@mantine/core';
import {Link, Outlet, useLoaderData} from '@remix-run/react';
import {
  IconBrandFacebook,
  IconBrandInstagram,
  IconBrandX,
  IconBrandYoutube,
  IconInfoCircle,
} from '@tabler/icons-react';

import {AE, DK, US} from 'country-flag-icons/react/3x2';
import {USER_METAOBJECT_QUERY} from '~/graphql/fragments/UserMetaobject';
import {UserProvider, useUser} from '~/hooks/use-user';
import {TranslationProvider, useTranslations} from '~/providers/Translation';
import {PAGE_QUERY} from './pages.$handle';

export function shouldRevalidate() {
  return false;
}

export const meta: MetaFunction<typeof loader> = ({data}) => {
  return [
    {
      title: `BySisters | ${data?.user?.fullname?.value ?? ''}`,
    },
  ];
};

export async function loader({params, context}: LoaderFunctionArgs) {
  const {storefront} = context;
  const {username} = params;

  if (!username) {
    throw new Error('Invalid request method');
  }

  const {metaobject: user} = await storefront.query(USER_METAOBJECT_QUERY, {
    variables: {
      username,
    },
    cache: context.storefront.CacheShort(),
  });

  const {page} = await context.storefront.query(PAGE_QUERY, {
    variables: {
      handle: 'artist',
    },
    cache: context.storefront.CacheLong(),
  });

  return json({
    user,
    page,
  });
}

export default function UserIndex() {
  const {user, page} = useLoaderData<typeof loader>();

  return (
    <TranslationProvider data={page?.translations}>
      <UserProvider user={user}>
        <Container size="xl" mb="xl" mt={rem(100)}>
          <AboutMe />
          <Outlet />
        </Container>
      </UserProvider>
    </TranslationProvider>
  );
}

function AboutMe() {
  const {t} = useTranslations();
  const user = useUser();

  return (
    <Flex direction="column" gap="xl" mb={rem(100)}>
      <Flex direction="column">
        <Flex gap={{base: 'md', sm: 'xl'}} align="center">
          <Avatar src={user?.image?.url} size={rem(150)} visibleFrom="sm" />
          <Avatar src={user?.image?.url} size={rem(100)} hiddenFrom="sm" />
          <Stack gap="4px">
            <Group>
              <Title order={1} fz="h2">
                {user?.fullname}{' '}
              </Title>
              <Text component="span" c="gray.5" fw="600">
                @{user.username}
              </Text>
            </Group>
            <Text fz="lg">
              {user?.shortDescription} <br />
            </Text>
            {user.speaks.length > 0 ? (
              <Stack gap="xs">
                <Flex wrap="wrap" gap="xs">
                  {user.speaks.includes('danish') && (
                    <Group gap="xs">
                      <DK width={18} height={18} />
                      {t('danish')}
                    </Group>
                  )}
                  {user.speaks.includes('english') && (
                    <Group gap="xs">
                      <US width={18} height={18} />
                      {t('english')}
                    </Group>
                  )}
                  {user.speaks.includes('arabic') && (
                    <Group gap="xs">
                      <AE width={18} height={18} />
                      {t('arabic')}
                    </Group>
                  )}
                </Flex>
              </Stack>
            ) : null}
          </Stack>
        </Flex>
      </Flex>

      <Grid gutter="xl">
        <Grid.Col span={{base: 12, sm: 8}}>
          <Stack>
            {user.aboutMe ? (
              <Stack gap="xs">
                <Title order={2} fw="600" fz="h5">
                  {t('artist_about_me')}
                </Title>
                <Spoiler maxHeight={54} showLabel="Show more" hideLabel="Hide">
                  <div
                    dangerouslySetInnerHTML={{
                      __html: user.aboutMe
                        .replace(/^<p>/, '')
                        .replace(/<\/p>$/, ''),
                    }}
                  ></div>
                </Spoiler>
              </Stack>
            ) : null}

            {user.professions.length > 0 ? (
              <Stack gap="xs">
                <Title order={2} fw="600" fz="h5">
                  {t('artist_professions')}
                </Title>
                <Flex wrap="wrap" gap="xs">
                  {user.professions.map((p) => (
                    <Badge
                      variant="outline"
                      c="black"
                      color="gray.4"
                      key={p}
                      fw="400"
                    >
                      {t(`profession_${p}`)}
                    </Badge>
                  ))}
                </Flex>
              </Stack>
            ) : null}

            {user.specialties.length > 0 ? (
              <Stack gap="xs">
                <Title order={2} fw="600" fz="h5">
                  {t('artist_skills')}
                </Title>
                <Flex wrap="wrap" gap="xs">
                  {user.specialties.map((p) => (
                    <Badge
                      variant="outline"
                      c="black"
                      color="gray.4"
                      key={p}
                      fw="400"
                    >
                      {t(`skills_${p}`)}
                    </Badge>
                  ))}
                </Flex>
              </Stack>
            ) : null}
          </Stack>
        </Grid.Col>
        <Grid.Col span={{base: 12, sm: 4}}>
          <Card withBorder radius="md">
            <Stack gap="xl">
              {user.social && Object.keys(user.social).length > 0 ? (
                <Stack gap="xs">
                  <Title order={2} fw="600" fz="h5">
                    {t('artist_social_media')}
                  </Title>
                  <Stack gap="xs">
                    {user.social.instagram ? (
                      <Group>
                        <IconBrandInstagram />
                        <UnstyledButton
                          component={Link}
                          to={user.social.instagram}
                          target="_blank"
                        >
                          {t('artist_instagram')}
                        </UnstyledButton>
                      </Group>
                    ) : null}
                    {user.social.youtube ? (
                      <Group>
                        <IconBrandYoutube />
                        <UnstyledButton
                          component={Link}
                          to={user.social.youtube}
                          target="_blank"
                        >
                          {t('artist_youtube')}
                        </UnstyledButton>
                      </Group>
                    ) : null}
                    {user.social.x ? (
                      <Group>
                        <IconBrandX />
                        <UnstyledButton
                          component={Link}
                          to={user.social.x}
                          target="_blank"
                        >
                          {t('artist_x')}
                        </UnstyledButton>
                      </Group>
                    ) : null}
                    {user.social.facebook ? (
                      <Group>
                        <IconBrandFacebook />
                        <UnstyledButton
                          component={Link}
                          to={user.social.facebook}
                          target="_blank"
                        >
                          {t('artist_facebook')}
                        </UnstyledButton>
                      </Group>
                    ) : null}
                  </Stack>
                </Stack>
              ) : null}
            </Stack>
          </Card>
        </Grid.Col>
      </Grid>

      {!user?.active ? (
        <Alert
          variant="light"
          title={t('artist_not_active_title')}
          icon={<IconInfoCircle />}
        >
          {t('artist_not_active_description')}
        </Alert>
      ) : null}
    </Flex>
  );
}
