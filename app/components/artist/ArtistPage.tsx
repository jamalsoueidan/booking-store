import {Box, Flex} from '@mantine/core';
import {Outlet} from '@remix-run/react';
import React from 'react';
import classes from './ArtistPage.module.css';

export default function ArtistPage({children}: {children: React.ReactNode}) {
  return (
    <Flex className={classes.flex} mih="100vh">
      <div
        className={classes.innerFlex}
        style={{
          backgroundColor: 'rgb(168, 139, 248)',
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
