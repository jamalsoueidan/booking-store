import {
  Button,
  Checkbox,
  Flex,
  Group,
  InputLabel,
  Stack,
  Text,
} from '@mantine/core';
import {IconFlag, IconX} from '@tabler/icons-react';
import {DK, US} from 'country-flag-icons/react/3x2';
import {useChangeFilter} from './useChangeFilter';

export function RemoveLanguageFilterButton() {
  const {value, onChange} = useChangeFilter('lang');
  const transform = value?.split(',').filter((p) => p.length > 0);

  if (!transform) {
    return null;
  }

  return (
    <Button
      variant="outline"
      c="black"
      color="gray.3"
      onClick={() => onChange(null)}
      size="md"
      rightSection={<IconX />}
      leftSection={<IconFlag />}
    >
      Sprog valg
    </Button>
  );
}

export function AddLanguageFilter() {
  const {value, onChange} = useChangeFilter('lang');
  const transform = value?.split(',').filter((p) => p.length > 0);

  return (
    <div>
      <Group gap="xs" mb="xs">
        <IconFlag />
        <InputLabel size="md">Skønhedseksperten taler</InputLabel>
      </Group>
      <Checkbox.Group value={transform} onChange={onChange}>
        <Stack gap="3px">
          <Checkbox.Card value="english" withBorder={false}>
            <Flex gap="xs" align="center">
              <Checkbox.Indicator />
              <Text>Engelsk</Text>
              <US width={16} height={16} />
            </Flex>
          </Checkbox.Card>
          <Checkbox.Card value="danish" withBorder={false}>
            <Flex gap="xs" align="center">
              <Checkbox.Indicator />
              <Text>Dansk</Text>
              <DK width={16} height={16} />
            </Flex>
          </Checkbox.Card>
        </Stack>
      </Checkbox.Group>
    </div>
  );
}
