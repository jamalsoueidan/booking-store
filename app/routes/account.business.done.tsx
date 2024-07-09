import {
  Button,
  Card,
  Center,
  Container,
  Flex,
  Group,
  Progress,
  rem,
  Stack,
  Text,
  Title,
} from '@mantine/core';

import {Link} from '@remix-run/react';
import {IconBusinessplan, IconParachute} from '@tabler/icons-react';
import {useTranslation} from 'react-i18next';
import {BottomSection, WrapSection} from './account.business';

export default function AccountServicesCreate() {
  const {t} = useTranslation(['account', 'global', 'zod']);

  return (
    <WrapSection>
      <Progress value={100} size="sm" />
      <Container size="md" py={{base: 'sm', md: rem(60)}}>
        <Stack mb="xl" ta="center">
          <div>
            <IconParachute style={{width: '5rem', height: '5rem'}} />
          </div>
          <Title fw="600" fz={{base: 'h2', sm: undefined}}>
            Tak, din profil er nu oprettet!
          </Title>
          <Center mt="xl">
            <Card
              component={Link}
              to="/business"
              p="md"
              bg="blue.1"
              w={{base: '100%', md: '30rem'}}
            >
              <Flex justify="space-between" align="center">
                <Stack>
                  <Group gap="sm">
                    <IconBusinessplan />
                    <Title order={4}>{t('business_title')}</Title>
                  </Group>
                  <Text>{t('business_text')}</Text>
                </Stack>
                <Button variant="default" color="blue">
                  {t('business_action')}
                </Button>
              </Flex>
            </Card>
          </Center>
        </Stack>
      </Container>
      <BottomSection></BottomSection>
    </WrapSection>
  );
}
