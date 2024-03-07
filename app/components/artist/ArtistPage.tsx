import {Box, Flex} from '@mantine/core';
import {Outlet} from '@remix-run/react';
import React from 'react';
import {type User} from '~/lib/api/model';
import classes from './ArtistPage.module.css';

export default function ArtistPage({
  children,
  artist,
}: {
  children: React.ReactNode;
  artist: User;
}) {
  return (
    <Flex className={classes.flex} mih="100vh">
      <div
        className={classes.innerFlex}
        style={{
          backgroundColor: '#a88bf8',
        }}
      >
        <div className={classes.sticky}>{children}</div>
      </div>
      <Box className={classes.box}>
        <Outlet context={{artist}} />
      </Box>
    </Flex>
  );
}
