import {Button, Checkbox, Group, InputLabel, Stack} from '@mantine/core';
import {IconWorldCheck, IconX} from '@tabler/icons-react';
import {useTranslations} from '~/providers/Translation';
import {useChangeFilter} from './useChangeFilter';

export function RemoveDayFilterButton() {
  const {value, onChange} = useChangeFilter('days');
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
      leftSection={<IconWorldCheck />}
    >
      {t('filter_day_reset_button')}
    </Button>
  );
}

export function AddDayFilter() {
  const {t} = useTranslations();
  const {value, onChange} = useChangeFilter('days');
  const transform = value?.split(',').filter((p) => p.length > 0);

  return (
    <div>
      <Group gap="xs" mb="xs">
        <IconWorldCheck />
        <InputLabel size="md">{t('filter_day_label')}</InputLabel>
      </Group>
      <Checkbox.Group value={transform} onChange={onChange}>
        <Stack gap="3px">
          <Checkbox value="monday" label={t('filter_day_monday')} />
          <Checkbox value="tuesday" label={t('filter_day_tuesday')} />
          <Checkbox value="wednesday" label={t('filter_day_wednesday')} />
          <Checkbox value="thursday" label={t('filter_day_thursday')} />
          <Checkbox value="friday" label={t('filter_day_friday')} />
          <Checkbox value="saturday" label={t('filter_day_saturday')} />
          <Checkbox value="sunday" label={t('filter_day_sunday')} />
        </Stack>
      </Checkbox.Group>
    </div>
  );
}
