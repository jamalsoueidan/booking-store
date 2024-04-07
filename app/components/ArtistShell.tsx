import {AppShell, Card, Flex, Group, type MantineColor} from '@mantine/core';
import {useDisclosure, useMediaQuery} from '@mantine/hooks';
import React from 'react';

const desktopHeaderHeight = 140;
const mobileHeaderHeight = 100;

const ArtistShell = ({
  color,
  children,
}: {
  color: MantineColor;
  children: React.ReactNode;
}) => {
  const [opened] = useDisclosure();

  return (
    <AppShell
      offsetScrollbars={false}
      padding="0"
      withBorder={false}
      layout="alt"
      header={{height: {base: 100, sm: 200}}}
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
      <AppShell.Navbar bg={`${color}.6`}></AppShell.Navbar>
      <AppShell.Aside bg={`${color}.6`}></AppShell.Aside>
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

const Header = ({
  children,
  color,
}: {
  children: React.ReactNode;
  color: MantineColor;
}) => {
  const isMobile = useMediaQuery('(max-width: 48em)');
  return (
    <AppShell.Header>
      <Group h="100%" w="inherit" align="flex-end" bg={`${color}.6`}>
        <Flex
          h={`${isMobile ? mobileHeaderHeight : desktopHeaderHeight}px`}
          w="100%"
          px={isMobile ? 'md' : 'xl'}
          bg={`${color}.1`}
          align="center"
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
