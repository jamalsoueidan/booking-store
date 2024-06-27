import {Container, Group, rem} from '@mantine/core';
import {Outlet} from '@remix-run/react';
import {AccountButton} from '~/components/account/AccountButton';

import {AccountContent} from '~/components/account/AccountContent';
import {AccountTitle} from '~/components/account/AccountTitle';

export default function AccountBusiness() {
  return (
    <Container size="md" my={{base: rem(80), sm: rem(100)}}>
      <AccountTitle linkBack="/business" heading="Din profil">
        <Group>
          <AccountButton to={'.'}>Profil</AccountButton>
          <AccountButton to={'social'}>Social Media</AccountButton>
          <AccountButton to={'theme'}>Tema</AccountButton>
          <AccountButton to={'upload'}>Skift billed</AccountButton>
        </Group>
      </AccountTitle>

      <AccountContent>
        <Outlet />
      </AccountContent>
    </Container>
  );
}
