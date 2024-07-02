import {
  Blockquote,
  Button,
  Flex,
  Image,
  Modal,
  rem,
  Stack,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import {useFetcher} from '@remix-run/react';
import {type CustomerDetailsQuery} from 'customer-accountapi.generated';
import {useEffect, useState} from 'react';
import {useMobile} from '~/hooks/isMobile';
import {type ActionResponse} from '~/routes/account.profile';

export const ModalAccount = ({customer}: {customer?: CustomerDetailsQuery}) => {
  const isMobile = useMobile();
  const fetcher = useFetcher<ActionResponse>();
  const [isModalOpen, setModalOpen] = useState(true);

  useEffect(() => {
    if (fetcher.state === 'idle' && fetcher.data && !fetcher.data.error) {
      setModalOpen(false);
    }
  }, [fetcher.state, fetcher.data]);

  // if user not logged in !customer
  // if user already firstname
  if (!customer) {
    return null;
  }

  if (customer.customer.firstName) {
    return null;
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    fetcher.submit(event.currentTarget, {method: 'post'});
  };

  return (
    <Modal.Root opened={isModalOpen} onClose={() => {}} shadow="0" centered>
      <Modal.Overlay
        color={isMobile ? '#FFF' : '#f5f5f5'}
        backgroundOpacity={1}
      />
      <Modal.Content radius="md" p="lg">
        <fetcher.Form
          action="/account/profile"
          method="post"
          onSubmit={handleSubmit}
        >
          <Flex p="xl" align="center" justify="center" mb="xl">
            <Image src="/logo.avif" w="200px" />
          </Flex>
          <Stack gap={rem(6)} mb="lg">
            <Title size="h2" fw="500">
              Personlig information
            </Title>
            <Text c="dimmed">
              For at gøre din oplevelse hos os mere personlig, bedes du venligst
              oplyse dit fornavn og efternavn.
            </Text>
          </Stack>
          {fetcher.data?.error ? (
            <Blockquote color="red" my="xl" data-testid="required-notification">
              <strong>Fejl:</strong>
              <br />
              {fetcher.data.error}
            </Blockquote>
          ) : null}
          <TextInput
            label="Fornavn"
            id="firstName"
            name="firstName"
            type="text"
            autoComplete="given-name"
            placeholder="Fornavn"
            aria-label="Fornavn"
            labelProps={{mb: '5px'}}
            mb="md"
            required
            data-testid="first-name-input"
          />

          <TextInput
            label="Efternavn"
            id="lastName"
            name="lastName"
            type="text"
            autoComplete="family-name"
            placeholder="Efternavn"
            aria-label="Efternavn"
            labelProps={{mb: '5px'}}
            mb="md"
            required
            data-testid="last-name-input"
          />
          <Button
            size="md"
            fullWidth
            disabled={fetcher.state !== 'idle'}
            type="submit"
          >
            Gem og forsæt
          </Button>
        </fetcher.Form>
      </Modal.Content>
    </Modal.Root>
  );
};
