import {Button, Group, InputLabel, Radio, Stack} from '@mantine/core';
import {IconGenderFemale, IconX} from '@tabler/icons-react';
import {useTranslation} from 'react-i18next';
import {useChangeFilter} from './useChangeFilter';

export function RemoveGenderFilterButton() {
  const {label, onChange} = useChangeFilter('gender');
  const {t} = useTranslation('users');
  if (!label) {
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
      leftSection={<IconGenderFemale />}
    >
      {label.toLowerCase() === 'woman' ? t('gender_woman') : null}
      {label.toLowerCase() === 'man' ? t('gender_men') : null}
    </Button>
  );
}

export function AddGenderFilter({tags}: {tags: string[] | null}) {
  const {t} = useTranslation('users');
  const {value, onChange} = useChangeFilter('gender');

  if (!tags) {
    return null;
  }

  return (
    <div>
      <Group gap="xs" mb="xs">
        <IconGenderFemale />
        <InputLabel size="md">{t('gender_label')}</InputLabel>
      </Group>
      <Radio.Group value={value} onChange={onChange}>
        <Stack gap="3px">
          <Radio value={null!} label={t('gender_all')} />
          <Radio value="woman" label={t('gender_woman')} />
          <Radio value="man" label={t('gender_men')} />
        </Stack>
      </Radio.Group>
    </div>
  );
}
