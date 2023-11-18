import {Group, Image, Radio, Text, UnstyledButton} from '@mantine/core';
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
  name: string;
  location: CustomerLocation;
}

export function AristLocationRadioCard({
  checked,
  defaultChecked,
  value,
  onChange,
  className,
  children,
  name,
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
        <div style={{flex: 1}}>
          <Text tt="uppercase" c="dimmed" fw={700} size="xs">
            {location.name}
          </Text>
          <Text mb="md" c="black" fw={700}>
            {location.fullAddress}
          </Text>
          <Group gap="xs" wrap="nowrap">
            {location.locationType === 'destination' ? (
              <Text size="xs">Kører til din adresse</Text>
            ) : null}
            {location.locationType !== 'destination' ? (
              <>
                <Text size="xs">
                  {location.originType === 'home' ? 'Hjemmeadrsese' : 'Salon'}
                </Text>
              </>
            ) : null}
          </Group>
        </div>
      </Group>

      <Radio
        checked={isChecked}
        name={name}
        value={value}
        onChange={() => {}}
        tabIndex={-1}
      />
    </UnstyledButton>
  );
}
