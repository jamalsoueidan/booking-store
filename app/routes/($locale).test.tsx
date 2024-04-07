import {Button, type MantineColor} from '@mantine/core';
import {useDisclosure, useMediaQuery} from '@mantine/hooks';
import {IconArrowLeft} from '@tabler/icons-react';
import {ArtistShell} from '../components/ArtistShell';

export default function Test({color = 'pink'}: {color: MantineColor}) {
  const [opened, {toggle}] = useDisclosure();
  const isMobile = useMediaQuery('(max-width: 48em)');

  return (
    <ArtistShell color="pink">
      <ArtistShell.Header color="pink">
        <Button
          variant="transparent"
          fw="bold"
          color={`${color}.9`}
          leftSection={<IconArrowLeft />}
        >
          asd
        </Button>
      </ArtistShell.Header>
      <ArtistShell.Main>adsojiasjdoi joiads jiodasjio as</ArtistShell.Main>
    </ArtistShell>
  );
}
