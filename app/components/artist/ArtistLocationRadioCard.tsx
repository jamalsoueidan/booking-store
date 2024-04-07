import {Group, Image, Radio, Stack, Text, UnstyledButton} from '@mantine/core';
import {useUncontrolled} from '@mantine/hooks';
import {type CustomerLocation} from '~/lib/api/model';
import estimate from '../../../public/estimate.svg';
import precision from '../../../public/precision.svg';
import classes from './ArtistLocationRadioCard.module.css';

interface AristLocationRadioCardProps {
  checked?: boolean;
  value: string;
  defaultChecked?: boolean;
  onChange?(checked: boolean): void;
  location: CustomerLocation;
}

export function AristLocationRadioCard({
  checked,
  defaultChecked,
  value,
  onChange,
  className,
  children,
  location,
  ...others
}: AristLocationRadioCardProps &
  Omit<
    React.ComponentPropsWithoutRef<'button'>,
    keyof AristLocationRadioCardProps
  >) {
  const [isChecked, handleChange] = useUncontrolled({
    value: checked,
    defaultValue: defaultChecked,
    finalValue: false,
    onChange,
  });

  return (
    <UnstyledButton
      {...others}
      onClick={() => handleChange(!isChecked)}
      data-checked={isChecked || undefined}
      className={classes.button}
    >
      <Group gap="md" w="100%">
        {location.locationType === 'destination' ? (
          <Image src={estimate} height="80" />
        ) : (
          <Image src={precision} height="80" />
        )}
        <Stack gap="xs" style={{flex: 1}}>
          <Text tt="uppercase" c="dimmed" fw={600} fz="xl">
            {location.locationType === 'destination' ? (
              <>Kører ud til din adresse</>
            ) : null}
            {location.locationType !== 'destination' ? (
              <>
                {location.originType === 'home'
                  ? 'Hjemme hos skønhedseksperten'
                  : 'I Salonen'}
              </>
            ) : null}
          </Text>
          <Text c="black" fw={500} fz="xs" lineClamp={1}>
            {location.name}, {location.fullAddress}
          </Text>
        </Stack>
      </Group>

      <Radio
        checked={isChecked}
        value={value}
        color="gray"
        onChange={() => {}}
        tabIndex={-1}
      />
    </UnstyledButton>
  );
}
