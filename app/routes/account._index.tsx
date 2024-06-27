import {
  Avatar,
  Button,
  Card,
  Container,
  Divider,
  Flex,
  Grid,
  Group,
  rem,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import {Form, Link, useOutletContext} from '@remix-run/react';
import {
  IconAddressBook,
  IconBusinessplan,
  IconLogout,
  IconShoppingBag,
  IconUser,
} from '@tabler/icons-react';
import {useTranslation} from 'react-i18next';
import {AccountMenuLink} from '~/components/account/AccountMenuLink';
import {useMobile} from '~/hooks/isMobile';
import {type AccountOutlet} from './account';

export default function AccountIndex() {
  const {t} = useTranslation(['account', 'global']);
  const {customer} = useOutletContext<AccountOutlet>();
  const isMobile = useMobile();

  return (
    <Container size="md" my={{base: rem(80), sm: rem(100)}}>
      <Grid align="center">
        <Grid.Col span={{base: 12, sm: 6}}>
          <Card p={{base: 'sm', sm: 'xl'}}>
            <Group>
              <Avatar size={isMobile ? 'lg' : 'xl'} />
              <div>
                <Title order={1} fw="600" fz={{base: 'h3', sm: 'h1'}}>
                  {customer.firstName} {customer.lastName}
                </Title>
                <Text c="dimmed" fw="500" fz="lg">
                  {customer.emailAddress?.emailAddress}
                </Text>
              </div>
            </Group>
          </Card>
        </Grid.Col>
        <Grid.Col span={{base: 12, sm: 6}}>
          {customer.tags.includes('business') ? (
            <Card component={Link} to="/business" p="md" bg="blue.1">
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
          ) : null}
        </Grid.Col>
        <Grid.Col span={{base: 12, sm: 6}}>
          <Card
            component={Link}
            to="/account/orders"
            withBorder
            p={{base: 'sm', sm: 'xl'}}
          >
            <Stack>
              <Group gap="sm">
                <IconShoppingBag />
                <Title order={4}>{t('orders_title')}</Title>
              </Group>
              <Text visibleFrom="sm">{t('orders_text')}</Text>
            </Stack>
          </Card>
        </Grid.Col>
        <Grid.Col span={{base: 12, sm: 6}}>
          <Card
            component={Link}
            to="/account/profile"
            withBorder
            p={{base: 'sm', sm: 'xl'}}
          >
            <Stack>
              <Group gap="sm">
                <IconUser />
                <Title order={4}>{t('profile_title')}</Title>
              </Group>
              <Text visibleFrom="sm">{t('profile_text')}</Text>
            </Stack>
          </Card>
        </Grid.Col>

        <Grid.Col span={{base: 12, sm: 6}}>
          <Card
            component={Link}
            to="/account/addresses"
            withBorder
            p={{base: 'sm', sm: 'xl'}}
          >
            <Stack>
              <Group gap="sm">
                <IconAddressBook />
                <Title order={4}>{t('address_title')}</Title>
              </Group>
              <Text visibleFrom="sm">{t('address_text')}</Text>
            </Stack>
          </Card>
        </Grid.Col>
        <Grid.Col span={{base: 12, sm: 6}}>
          {!customer.tags.includes('business') ? (
            <Card
              component={Link}
              to="/account/business"
              withBorder
              p={{base: 'sm', sm: 'xl'}}
              bg="violet.3"
            >
              <Flex justify="space-between" align="center">
                <Stack>
                  <Group gap="sm">
                    <IconBusinessplan />
                    <Title order={4}>{t('partner_title')}</Title>
                  </Group>
                  <Text>{t('partner_text')}</Text>
                </Stack>
                <Button variant="default" c="violet" color="white">
                  {t('partner_action')}
                </Button>
              </Flex>
            </Card>
          ) : null}
        </Grid.Col>
      </Grid>
      <Divider mt="xl" mb="md" />
      <Flex justify="flex-end">
        <Form method="POST" action="/account/logout">
          <AccountMenuLink
            item={{
              link: '#',
              label: t('logout', {ns: 'global'}),
              icon: IconLogout,
              isBusiness: true,
              data: 'logout-link',
              deactiveActive: true,
            }}
            onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
              e.preventDefault();
              const target = e.target as Element;
              const form = target.closest('form');
              if (form) {
                (form as HTMLFormElement).submit();
              }
            }}
          />
        </Form>
      </Flex>
    </Container>
  );
}
