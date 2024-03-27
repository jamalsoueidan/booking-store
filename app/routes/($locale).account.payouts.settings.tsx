import {
  Button,
  Flex,
  InputBase,
  Stack,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import {json, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {IMaskInput} from 'react-imask';
import {getCustomer} from '~/lib/get-customer';

export async function loader({context}: LoaderFunctionArgs) {
  const customer = await getCustomer({context});
  return json({});
}

export default function AccountPayoutsSettings() {
  return (
    <Stack align="flex-start">
      <div>
        <Title order={3}>Bank konto</Title>
        <Text c="dimmed">
          Vi skal bruge din regnr og kontonummer for at sende dig din
          udbetalinger.
        </Text>
      </div>

      <TextInput label="Fuldnavn" />
      <Flex gap="lg">
        <InputBase label="Regnr" component={IMaskInput} mask="0000" w="80" />
        <InputBase
          label="Kontonummer"
          component={IMaskInput}
          mask="0000-0000-0000-0000"
        />
      </Flex>

      <Button>Gem</Button>
    </Stack>
  );
}
