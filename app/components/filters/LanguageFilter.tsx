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
import {useTranslations} from '~/providers/Translation';
import {useChangeFilter} from './useChangeFilter';

export function RemoveLanguageFilterButton() {
  const {value, onChange} = useChangeFilter('lang');
  const {t} = useTranslations();
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
      {t('filter_language_reset_button')}
    </Button>
  );
}

export function AddLanguageFilter() {
  const {t} = useTranslations();
  const {value, onChange} = useChangeFilter('lang');
  const transform = value?.split(',').filter((p) => p.length > 0);

  return (
    <div>
      <Group gap="xs" mb="xs">
        <IconFlag />
        <InputLabel size="md">{t('filter_language_label')}</InputLabel>
      </Group>
      <Checkbox.Group value={transform} onChange={onChange}>
        <Stack gap="3px">
          <Checkbox.Card value="english" withBorder={false}>
            <Flex gap="xs" align="center">
              <Checkbox.Indicator />
              <Text>{t('filter_language_english')}</Text>
              <US width={16} height={16} />
            </Flex>
          </Checkbox.Card>
          <Checkbox.Card value="danish" withBorder={false}>
            <Flex gap="xs" align="center">
              <Checkbox.Indicator />
              <Text>{t('filter_language_danish')}</Text>
              <DK width={16} height={16} />
            </Flex>
          </Checkbox.Card>
        </Stack>
      </Checkbox.Group>
    </div>
  );
}
