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

export function AddDayFilter({tags}: {tags: string[] | null}) {
  const {t} = useTranslation('global');
  const {value, onChange} = useChangeFilter('days');
  const transform = value?.split(',').filter((p) => p.length > 0);

  if (!tags) {
    return null;
  }

  return (
    <div>
      <Group gap="xs" mb="xs">
        <IconWorldCheck />
        <InputLabel size="md">{t('day_label')}</InputLabel>
      </Group>
      <Checkbox.Group value={transform} onChange={onChange}>
        <Stack gap="3px">
          {tags.includes('monday') ? (
            <Checkbox value="monday" label={t('monday')} />
          ) : null}
          {tags.includes('tuesday') ? (
            <Checkbox value="tuesday" label={t('tuesday')} />
          ) : null}
          {tags.includes('wednesday') ? (
            <Checkbox value="wednesday" label={t('wednesday')} />
          ) : null}
          {tags.includes('thursday') ? (
            <Checkbox value="thursday" label={t('thursday')} />
          ) : null}
          {tags.includes('friday') ? (
            <Checkbox value="friday" label={t('friday')} />
          ) : null}
          {tags.includes('saturday') ? (
            <Checkbox value="saturday" label={t('saturday')} />
          ) : null}
          {tags.includes('sunday') ? (
            <Checkbox value="sunday" label={t('sunday')} />
          ) : null}
        </Stack>
      </Checkbox.Group>
    </div>
  );
}
