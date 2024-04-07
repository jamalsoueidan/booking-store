import {Group} from '@mantine/core';
import {Outlet} from '@remix-run/react';
import {AccountButton} from '~/components/account/AccountButton';

import {AccountContent} from '~/components/account/AccountContent';
import {AccountTitle} from '~/components/account/AccountTitle';

export default function AccountBusiness() {
  return (
    <>
      <AccountTitle heading="Din profil">
        <Group>
          <AccountButton to={'.'}>Profil</AccountButton>
          <AccountButton to={'social'}>Social Media</AccountButton>
          <AccountButton to={'theme'}>Tema</AccountButton>
          <AccountButton to={'/account/upload'}>Skift billed</AccountButton>
        </Group>
      </AccountTitle>

      <AccountContent>
        <Outlet />
      </AccountContent>
    </>
  );
}
