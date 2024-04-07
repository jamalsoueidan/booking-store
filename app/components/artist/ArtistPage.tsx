import {Box, Flex} from '@mantine/core';
import {Outlet} from '@remix-run/react';
import React from 'react';
import {useUser} from '~/hooks/use-user';
import classes from './ArtistPage.module.css';

export default function ArtistPage({children}: {children: React.ReactNode}) {
  const user = useUser();

  return (
    <Flex className={classes.flex} mih="100vh">
      <div
        className={classes.innerFlex}
        style={{
          backgroundColor: `var(--mantine-color-${user.theme.color}-6)`,
        }}
      >
        <div className={classes.sticky}>{children}</div>
      </div>
      <Box className={classes.box}>
        <Outlet />
      </Box>
    </Flex>
  );
}
