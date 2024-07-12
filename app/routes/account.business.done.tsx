import {
  Anchor,
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

import {json, Link, useLoaderData} from '@remix-run/react';
import {type LoaderFunctionArgs} from '@remix-run/server-runtime';
import {IconBusinessplan, IconParachute} from '@tabler/icons-react';
import {useTranslation} from 'react-i18next';
import {USER_METAOBJECT_QUERY} from '~/graphql/fragments/UserMetaobject';
import {getBookingShopifyApi} from '~/lib/api/bookingShopifyApi';
import {getCustomer} from '~/lib/get-customer';
import {BottomSection, WrapSection} from './account.business';

export async function loader({context}: LoaderFunctionArgs) {
  const customerId = await getCustomer({context});

  const {payload} = await getBookingShopifyApi().customerGet(customerId);

  const {storefront} = context;

  const {metaobject: user} = await storefront.query(USER_METAOBJECT_QUERY, {
    variables: {
      username: payload.username,
    },
    cache: context.storefront.CacheShort(),
  });

  return json({user});
}

export default function AccountServicesCreate() {
  const {user} = useLoaderData<typeof loader>();
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
          <Text ta="center">
            Din profil er oprettet, og du kan besøge din profils side her. Din
            profilside er ikke godkendt endnu! Alle de oplysninger, du har
            indtastet i de tidligere trin, kan du redigere i din
            virksomhedskonto. Du kan også tilføje flere lokationer, vagtplaner
            og ydelser.
          </Text>
          <Center mt="xl">
            <Group gap="3px">
              <Text>Besøg din profils side her: </Text>
              <Anchor
                component={Link}
                to={`/${user?.username?.value}`}
                target="_blank"
              >
                {user?.fullname?.value}
              </Anchor>
            </Group>
          </Center>
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
