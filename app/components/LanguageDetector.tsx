import {ActionIcon, Card, Flex, Modal, rem, Title} from '@mantine/core';
import {AE, DK, US} from 'country-flag-icons/react/1x1';
import {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';

export const LanguageDetector = () => {
  const {i18n} = useTranslation();
  const [showModal, setShowModal] = useState(false);
  const [currentPath, setCurrentPath] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setCurrentPath(
        window.location.pathname +
          window.location.search +
          window.location.hash,
      );

      const browserLanguage = navigator.language.split('-')[0];
      const currentLanguage = i18n.language.split('-')[0];
      const userDecision = localStorage.getItem('languageDecision');

      if (!userDecision && browserLanguage !== currentLanguage) {
        setShowModal(true);
      }
    }
  }, [i18n.language]);

  const getNewUrl = (newDomain: string) => `${newDomain}${currentPath}`;

  const changeLanguage = (url: string) => {
    localStorage.setItem('languageDecision', 'true');
    window.location.href = url;
  };

  const closeModal = () => {
    localStorage.setItem('languageDecision', 'true');
    setShowModal(false);
  };

  return (
    <Modal opened={showModal} onClose={closeModal}>
      <Flex gap="md" align="center" justify="center">
        <Card withBorder onClick={closeModal}>
          <ActionIcon size={rem(100)} radius={rem(100)} bg="transparent">
            <DK style={{width: '100px', height: '100px'}} />
          </ActionIcon>
          <Title fw="500" ta="center">
            Dansk
          </Title>
        </Card>
        <Card
          withBorder
          onClick={() => changeLanguage(getNewUrl('https://en.bysisters.dk'))}
        >
          <ActionIcon size={rem(100)} radius={rem(100)} bg="transparent">
            <US style={{width: '100px', height: '100px'}} />
          </ActionIcon>
          <Title fw="500" ta="center">
            English
          </Title>
        </Card>
        <Card
          withBorder
          onClick={() => changeLanguage(getNewUrl('https://ar.bysisters.dk'))}
        >
          <ActionIcon size={rem(100)} radius={rem(100)} bg="transparent">
            <AE style={{width: '100px', height: '100px'}} />
          </ActionIcon>
          <Title fw="400" ta="center">
            عربي
          </Title>
        </Card>
      </Flex>
    </Modal>
  );
};
