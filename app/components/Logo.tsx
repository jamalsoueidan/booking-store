import {Flex, Image, rem, Title, UnstyledButton} from '@mantine/core';
import {Link} from '@remix-run/react';
import {useLanguage} from '~/hooks/useLanguage';
import logo from '/Artboard4.svg';

export function Logo({close}: {close: () => void}) {
  const language = useLanguage();

  return (
    <UnstyledButton component={Link} to="/" onClick={close}>
      <Title
        order={1}
        component={Flex}
        lh="xs"
        fz={rem(28)}
        fw="500"
        data-testid="logo-login"
      >
        {language !== 'AR' ? (
          <>
            ByS
            <Image src={logo} alt="it's me" h="auto" w="8px" mx="2px" />
            sters
          </>
        ) : (
          <>
            باي
            <Image src={logo} alt="it's me" h="auto" w="8px" mx="2px" />
            سيستر
          </>
        )}
      </Title>
    </UnstyledButton>
  );
}
