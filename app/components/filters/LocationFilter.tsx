import {Button, Group, InputLabel, Radio, Stack, Text} from '@mantine/core';
import {
  IconBuilding,
  IconCar,
  IconHome,
  IconLocation,
  IconPhone,
  IconX,
} from '@tabler/icons-react';
import {useTranslation} from 'react-i18next';
import {CustomerLocationBaseLocationType} from '~/lib/api/model';
import {useChangeFilter} from './useChangeFilter';

export function RemoveLocationFilterButton() {
  const {t} = useTranslation(['global']);
  const {value, onChange} = useChangeFilter('location');
  if (!value) {
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
      leftSection={<IconLocation />}
    >
      {value === CustomerLocationBaseLocationType.destination &&
        t('location_destination')}
      {value === CustomerLocationBaseLocationType.commercial &&
        t('location_commercial')}
      {value === CustomerLocationBaseLocationType.home && t('location_home')}
      {value === CustomerLocationBaseLocationType.virtual &&
        t('location_virtual')}
    </Button>
  );
}

export function AddLocationFilter({tags}: {tags: string[]}) {
  const {t} = useTranslation(['global']);
  const {value, onChange} = useChangeFilter('location');

  return (
    <div>
      <Group gap="xs" mb="xs">
        <IconLocation />
        <InputLabel size="md">{t('location_label')}</InputLabel>
      </Group>
      <Radio.Group value={value} onChange={onChange}>
        <Stack gap="3px">
          <Radio.Card value={null!} withBorder={false}>
            <Group wrap="nowrap" align="center">
              <Radio.Indicator />
              <div>
                <Text>{t('location_all_types')}</Text>
              </div>
            </Group>
          </Radio.Card>
          {tags.includes(CustomerLocationBaseLocationType.destination) ? (
            <Radio.Card
              value={CustomerLocationBaseLocationType.destination}
              withBorder={false}
            >
              <Group wrap="nowrap" align="center">
                <Radio.Indicator icon={() => <IconCar color="black" />} />
                <div>
                  <Text>{t('location_destination')}</Text>
                </div>
              </Group>
            </Radio.Card>
          ) : null}
          {tags.includes(CustomerLocationBaseLocationType.commercial) ? (
            <Radio.Card
              value={CustomerLocationBaseLocationType.commercial}
              withBorder={false}
            >
              <Group wrap="nowrap" align="center">
                <Radio.Indicator icon={() => <IconBuilding color="black" />} />
                <div>
                  <Text>{t('location_commercial')}</Text>
                </div>
              </Group>
            </Radio.Card>
          ) : null}
          {tags.includes(CustomerLocationBaseLocationType.home) ? (
            <Radio.Card
              value={CustomerLocationBaseLocationType.home}
              withBorder={false}
            >
              <Group wrap="nowrap" align="center">
                <Radio.Indicator icon={() => <IconHome color="black" />} />
                <div>
                  <Text>{t('location_home')}</Text>
                </div>
              </Group>
            </Radio.Card>
          ) : null}
          {tags.includes(CustomerLocationBaseLocationType.virtual) ? (
            <Radio.Card
              value={CustomerLocationBaseLocationType.virtual}
              withBorder={false}
            >
              <Group wrap="nowrap" align="center">
                <Radio.Indicator icon={() => <IconPhone color="black" />} />
                <div>
                  <Text>{t('location_virtual')}</Text>
                </div>
              </Group>
            </Radio.Card>
          ) : null}
        </Stack>
      </Radio.Group>
    </div>
  );
}
