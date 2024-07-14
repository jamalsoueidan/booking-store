import {
  Button,
  Checkbox,
  Group,
  InputLabel,
  Select,
  Stack,
} from '@mantine/core';
import {useSearchParams} from '@remix-run/react';
import {IconLocation, IconWorld, IconX} from '@tabler/icons-react';
import {useTranslation} from 'react-i18next';
import {type UserCollectionFilterFragment} from 'storefrontapi.generated';
import {useFilterCounts} from '~/hooks/useFilterCounts';
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

export function AddCityFilter({tags}: {tags: string[] | null}) {
  const {t} = useTranslation('global');
  const {value, onChange} = useChangeFilter('city');

  if (!tags) {
    return null;
  }

  const data = tags.sort().map((p) => ({
    label: `${p[0].toUpperCase()}${p.substring(1)}`,
    value: p,
  }));

  return (
    <Select
      size="md"
      value={value}
      label={t('city_label')}
      placeholder={t('city_placeholder')}
      onChange={onChange}
      leftSection={<IconWorld />}
      data={data}
      clearable
    />
  );
}

export function CityFilter({
  filters,
}: {
  filters: UserCollectionFilterFragment[];
}) {
  const [searchParams, setSearchParams] = useSearchParams();
  const {t} = useTranslation(['global']);
  const cities = useFilterCounts(filters as any, 'city');

  return (
    <Stack>
      <Group gap="xs">
        <IconLocation />
        <InputLabel size="md">{t('city_label')}</InputLabel>
      </Group>
      <Checkbox.Group
        value={searchParams.getAll('city')}
        onChange={(cities: string[]) =>
          setSearchParams(
            (prev) => {
              prev.delete('city');
              cities.forEach((item) => {
                prev.append('city', item);
              });
              return prev;
            },
            {preventScrollReset: true},
          )
        }
      >
        <Stack gap="xs">
          {Object.keys(cities).map((city) => (
            <Checkbox
              key={city}
              value={city}
              label={`${city[0].toUpperCase()}${city.substring(1)} (${
                cities[city]
              })`}
              disabled={cities[city] === 0}
            />
          ))}
        </Stack>
      </Checkbox.Group>
    </Stack>
  );
}
