import {
  Box,
  Button,
  Card,
  Center,
  Flex,
  Image,
  rem,
  Stack,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import {useFetcher} from '@remix-run/react';
import {type CustomerDetailsQuery} from 'customer-accountapi.generated';
import {useMobile} from '~/hooks/isMobile';
import {type ActionResponse} from '~/routes/account.profile';

export const ModalAccount = ({customer}: {customer?: CustomerDetailsQuery}) => {
  const isMobile = useMobile();
  const fetcher = useFetcher<ActionResponse>();

  // if user not logged in !customer
  // if user already firstname
  if (!customer) {
    return null;
  }

  if (customer.customer.firstName || !!fetcher.data) {
    return null;
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    fetcher.submit(event.currentTarget, {method: 'post'});
  };

  return (
    <Box
      style={{zIndex: 201}}
      pos="absolute"
      top="0"
      left="0"
      right="0"
      bottom="0"
      bg={isMobile ? '#FFF' : '#f5f5f5'}
    >
      <Center w="100%" h="100vh">
        <Card bg="white" radius="sm" w={{base: '100%', sm: '476px'}}>
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
              <Text c="dimmed" fz="sm">
                For at gøre din oplevelse hos os mere personlig, bedes du
                venligst oplyse dit fornavn og efternavn.
              </Text>
            </Stack>

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
        </Card>
      </Center>
    </Box>
  );
};
