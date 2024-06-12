import {Button, Select} from '@mantine/core';
import {IconWorld, IconX} from '@tabler/icons-react';
import {useTranslations} from '~/providers/Translation';
import {useChangeFilter} from './useChangeFilter';

export function RemoveCityFilterButton() {
  const {label, onChange} = useChangeFilter('city');
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
      leftSection={<IconWorld />}
    >
      {label}
    </Button>
  );
}

export function AddCityFilter({tags}: {tags: string[]}) {
  const {t} = useTranslations();
  const {value, onChange} = useChangeFilter('city');

  const data = tags.sort().map((p) => ({
    label: `${p[0].toUpperCase()}${p.substring(1)}`,
    value: p,
  }));

  return (
    <Select
      size="md"
      value={value}
      label={t('filter_city_label')}
      placeholder={t('filter_city_placeholder')}
      onChange={onChange}
      leftSection={<IconWorld />}
      data={data}
      clearable
    />
  );
}
