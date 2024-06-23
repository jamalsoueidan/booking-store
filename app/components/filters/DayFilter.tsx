import {Button, Checkbox, Group, InputLabel, Stack} from '@mantine/core';
import {IconWorldCheck, IconX} from '@tabler/icons-react';
import {useTranslation} from 'react-i18next';
import {useChangeFilter} from './useChangeFilter';

export function RemoveDayFilterButton() {
  const {value, onChange} = useChangeFilter('days');
  const {t} = useTranslation(['global']);
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
      leftSection={<IconWorldCheck />}
    >
      {t('day_reset_button')}
    </Button>
  );
}

export function AddDayFilter() {
  const {t} = useTranslation('global');
  const {value, onChange} = useChangeFilter('days');
  const transform = value?.split(',').filter((p) => p.length > 0);

  return (
    <div>
      <Group gap="xs" mb="xs">
        <IconWorldCheck />
        <InputLabel size="md">{t('day_label')}</InputLabel>
      </Group>
      <Checkbox.Group value={transform} onChange={onChange}>
        <Stack gap="3px">
          <Checkbox value="monday" label={t('monday')} />
          <Checkbox value="tuesday" label={t('tuesday')} />
          <Checkbox value="wednesday" label={t('wednesday')} />
          <Checkbox value="thursday" label={t('thursday')} />
          <Checkbox value="friday" label={t('friday')} />
          <Checkbox value="saturday" label={t('saturday')} />
          <Checkbox value="sunday" label={t('sunday')} />
        </Stack>
      </Checkbox.Group>
    </div>
  );
}
