import {AppShell, Card, Flex, Group, rem, Stepper} from '@mantine/core';
import {useDisclosure, useMediaQuery} from '@mantine/hooks';
import {useLocation} from '@remix-run/react';
import React from 'react';
import {useUser} from '~/hooks/use-user';

const ArtistShell = ({children}: {children: React.ReactNode}) => {
  const user = useUser();
  const [opened] = useDisclosure();

  return (
    <AppShell
      offsetScrollbars={false}
      padding="0"
      withBorder={false}
      layout="alt"
      header={{height: {base: 110, sm: 200}}}
      footer={{height: 65}}
      navbar={{
        width: {base: 100, md: 250, lg: 300, xl: 450},
        breakpoint: 'sm',
        collapsed: {desktop: false, mobile: !opened},
      }}
      aside={{
        width: {base: 100, md: 250, lg: 300, xl: 450},
        breakpoint: 'sm',
        collapsed: {desktop: false, mobile: !opened},
      }}
    >
      {children}
      <AppShell.Navbar bg={`${user.theme}.6`}></AppShell.Navbar>
      <AppShell.Aside bg={`${user.theme}.6`}></AppShell.Aside>
    </AppShell>
  );
};

const Footer = ({children}: {children: React.ReactNode}) => {
  return (
    <AppShell.Footer p="md" style={{boxShadow: '0 0 50px rgba(0, 0, 0, 0.3)'}}>
      {children}
    </AppShell.Footer>
  );
};

const Header = ({children}: {children: React.ReactNode}) => {
  const isMobile = useMediaQuery('(max-width: 48em)');
  const user = useUser();
  const location = useLocation();
  let active = 0;

  if (location.pathname.includes('pick-location')) {
    active = 1;
  }

  if (location.pathname.includes('pick-more')) {
    active = 2;
  }

  if (location.pathname.includes('pick-datetime')) {
    active = 3;
  }

  if (location.pathname.includes('completed')) {
    active = 4;
  }

  return (
    <AppShell.Header>
      <Group w="inherit" align="flex-end" bg={`${user.theme}.6`} gap="0">
        <Stepper
          w="100%"
          my={{base: '0', sm: 'xl'}}
          active={active}
          bg={`${user.theme}.6`}
          styles={{
            stepBody: {
              marginInlineStart: 'unset',
              color: '#fff',
            },

            step: {
              display: 'flex',
              flexDirection: 'column',
              marginLeft: rem(6),
              marginRight: rem(6),
              gap: '4px',
              transform: isMobile ? 'scale(.7)' : '',
            },

            stepIcon: {},

            separator: {
              borderTop: '1px solid #FFF',
              height: '1px',
              marginInlineStart: 'unset',
            },
          }}
        >
          <Stepper.Step
            color={`${user.theme}.6`}
            label="Produkt"
            iconSize={0}
          ></Stepper.Step>
          <Stepper.Step
            color={`${user.theme}.6`}
            label="Lokation"
          ></Stepper.Step>
          <Stepper.Step
            color={`${user.theme}.6`}
            label="Tilvalg"
          ></Stepper.Step>
          <Stepper.Step
            color={`${user.theme}.6`}
            label="Tidsbestilling"
          ></Stepper.Step>
        </Stepper>
        <Flex
          mih={isMobile ? '50px' : '80px'}
          w="100%"
          px={{base: 'md', sm: 'xl'}}
          bg={`${user.theme}.1`}
          align="center"
          justify="center"
          direction="column"
          style={
            isMobile
              ? {}
              : {borderTopLeftRadius: '25px', borderTopRightRadius: '25px'}
          }
        >
          {children}
        </Flex>
      </Group>
    </AppShell.Header>
  );
};

const Main = ({children}: {children: React.ReactNode}) => {
  return (
    <AppShell.Main>
      <Card pb="xl">{children}</Card>
    </AppShell.Main>
  );
};

ArtistShell.Header = Header;
ArtistShell.Main = Main;
ArtistShell.Footer = Footer;

export {ArtistShell};
