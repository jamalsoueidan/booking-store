import {
  Button,
  Checkbox,
  type CheckboxProps,
  Group,
  InputLabel,
  Radio,
  Stack,
  Text,
} from '@mantine/core';
import {useSearchParams} from '@remix-run/react';
import {
  IconBiohazard,
  IconBuilding,
  IconCar,
  IconHome,
  IconLocation,
  IconPhone,
  IconX,
} from '@tabler/icons-react';
import {useTranslation} from 'react-i18next';
import {type UserCollectionFilterFragment} from 'storefrontapi.generated';
import {useFilterCounts} from '~/hooks/useFilterCounts';
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

export function AddLocationFilter({tags}: {tags: string[] | null}) {
  const {t} = useTranslation(['global']);
  const {value, onChange} = useChangeFilter('location');

  if (!tags) {
    return null;
  }

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

export function LocationFilter({
  filters,
}: {
  filters: UserCollectionFilterFragment[];
}) {
  const [searchParams, setSearchParams] = useSearchParams();
  const {t} = useTranslation(['global']);
  const locationType = useFilterCounts(filters as any, 'location_type');

  const CheckboxIconCar: CheckboxProps['icon'] = ({indeterminate, ...others}) =>
    indeterminate ? <IconBiohazard {...others} /> : <IconCar {...others} />;

  const CheckboxIconHome: CheckboxProps['icon'] = ({
    indeterminate,
    ...others
  }) =>
    indeterminate ? <IconBiohazard {...others} /> : <IconHome {...others} />;

  const CheckboxIconBuilding: CheckboxProps['icon'] = ({
    indeterminate,
    ...others
  }) =>
    indeterminate ? (
      <IconBiohazard {...others} />
    ) : (
      <IconBuilding {...others} />
    );

  const CheckboxIconPhone: CheckboxProps['icon'] = ({
    indeterminate,
    ...others
  }) =>
    indeterminate ? <IconBiohazard {...others} /> : <IconPhone {...others} />;

  return (
    <Stack>
      <Group gap="xs">
        <IconLocation />
        <InputLabel size="md">{t('location_label')}</InputLabel>
      </Group>
      <Checkbox.Group
        value={searchParams.getAll('locationType')}
        onChange={(locationType: string[]) =>
          setSearchParams(
            (prev) => {
              prev.delete('locationType');
              locationType.forEach((item) => {
                prev.append('locationType', item);
              });
              return prev;
            },
            {preventScrollReset: true},
          )
        }
      >
        <Stack gap="xs">
          <Checkbox
            value={CustomerLocationBaseLocationType.destination}
            icon={CheckboxIconCar}
            label={`${t('location_destination')} (${
              locationType[CustomerLocationBaseLocationType.destination] || 0
            })`}
            disabled={
              locationType[CustomerLocationBaseLocationType.destination] ===
                0 || !locationType[CustomerLocationBaseLocationType.destination]
            }
          />

          <Checkbox
            icon={CheckboxIconBuilding}
            value={CustomerLocationBaseLocationType.commercial}
            label={`${t('location_commercial')} (${
              locationType[CustomerLocationBaseLocationType.commercial] || 0
            })`}
            disabled={
              locationType[CustomerLocationBaseLocationType.commercial] === 0 ||
              !locationType[CustomerLocationBaseLocationType.commercial]
            }
          />

          <Checkbox
            icon={CheckboxIconHome}
            value={CustomerLocationBaseLocationType.home}
            label={`${t('location_home')} (
                  ${locationType[CustomerLocationBaseLocationType.home] || 0})`}
            disabled={
              locationType[CustomerLocationBaseLocationType.home] === 0 ||
              !locationType[CustomerLocationBaseLocationType.home]
            }
          />
          <Checkbox
            icon={CheckboxIconPhone}
            value={CustomerLocationBaseLocationType.virtual}
            label={`${t('location_virtual')} (
                  ${
                    locationType[CustomerLocationBaseLocationType.virtual] || 0
                  })`}
            disabled={
              locationType[CustomerLocationBaseLocationType.virtual] === 0 ||
              !locationType[CustomerLocationBaseLocationType.virtual]
            }
          />
        </Stack>
      </Checkbox.Group>
    </Stack>
  );
}
