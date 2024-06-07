import {
  Badge,
  Container,
  Flex,
  Grid,
  Group,
  Stack,
  Title,
  UnstyledButton,
} from '@mantine/core';

import {Link} from '@remix-run/react';
import {
  IconBrandFacebook,
  IconBrandInstagram,
  IconBrandX,
  IconBrandYoutube,
} from '@tabler/icons-react';
import {DK, US} from 'country-flag-icons/react/3x2';
import {useUser} from '~/hooks/use-user';
import {
  ProfessionTranslations,
  SpecialtiesTranslations,
} from './api.users.professions';

export function shouldRevalidate() {
  return false;
}

export default function AboutMe() {
  const user = useUser();

  return (
    <Container size="md">
      <Grid gutter="xl">
        <Grid.Col span={{base: 12, sm: 8}}>
          <Stack gap="xl">
            {user.aboutMe ? (
              <Stack gap="xs">
                <Title order={4}>Om mig</Title>
                <div dangerouslySetInnerHTML={{__html: user.aboutMe}}></div>
              </Stack>
            ) : null}

            {user.professions.length > 0 ? (
              <Stack gap="xs">
                <Title order={4}>Professioner</Title>
                <Flex wrap="wrap" gap="xs">
                  {user.professions.map((p) => (
                    <Badge
                      variant="outline"
                      c="black"
                      color="gray.4"
                      key={p}
                      fw="400"
                    >
                      {ProfessionTranslations[p]}
                    </Badge>
                  ))}
                </Flex>
              </Stack>
            ) : null}

            {user.specialties.length > 0 ? (
              <Stack gap="xs">
                <Title order={4}>Skills</Title>
                <Flex wrap="wrap" gap="xs">
                  {user.specialties.map((p) => (
                    <Badge
                      variant="outline"
                      c="black"
                      color="gray.4"
                      key={p}
                      fw="400"
                    >
                      {SpecialtiesTranslations[p]}
                    </Badge>
                  ))}
                </Flex>
              </Stack>
            ) : null}
          </Stack>
        </Grid.Col>
        <Grid.Col span={{base: 12, sm: 4}}>
          <Stack gap="xl">
            {user.speaks.length > 0 ? (
              <Stack gap="xs">
                <Title order={4}>Sprog</Title>
                <Flex wrap="wrap" gap="xs">
                  {user.speaks.includes('danish') && (
                    <DK width={18} height={18} />
                  )}
                  {user.speaks.includes('english') && (
                    <US width={18} height={18} />
                  )}
                </Flex>
              </Stack>
            ) : null}

            {user.social && Object.keys(user.social).length > 0 ? (
              <Stack gap="xs">
                <Title order={4}>Social</Title>
                <Stack gap="xs">
                  {user.social.instagram ? (
                    <Group>
                      <IconBrandInstagram />
                      <UnstyledButton
                        component={Link}
                        to={user.social.instagram}
                        target="_blank"
                      >
                        Instagram
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
                        Youtube
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
                        X
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
                        Facebook
                      </UnstyledButton>
                    </Group>
                  ) : null}
                </Stack>
              </Stack>
            ) : null}
          </Stack>
        </Grid.Col>
      </Grid>
    </Container>
  );
}
