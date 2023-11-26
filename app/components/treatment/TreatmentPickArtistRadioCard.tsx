import {
  AspectRatio,
  CheckIcon,
  Radio,
  Stack,
  Text,
  UnstyledButton,
} from '@mantine/core';
import {useUncontrolled} from '@mantine/hooks';

import {Image} from '@shopify/hydrogen';
import {type ProductsGetUsersByVariant} from '~/lib/api/model';
import classes from './TreatmentPickArtistRadioCard.module.css';

interface TreatmentPickArtistRadioCardProps {
  checked?: boolean;
  value: string;
  defaultChecked?: boolean;
  onChange?(checked: boolean): void;
  artist: ProductsGetUsersByVariant;
}

export function TreatmentPickArtistRadioCard({
  checked,
  defaultChecked,
  value,
  onChange,
  className,
  children,
  artist,
  ...others
}: TreatmentPickArtistRadioCardProps &
  Omit<
    React.ComponentPropsWithoutRef<'button'>,
    keyof TreatmentPickArtistRadioCardProps
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
      <Stack gap="xs" justify="center" align="center">
        <AspectRatio ratio={1 / 1} style={{width: '75px'}}>
          <Image
            data={artist.images.profile}
            aspectRatio="1/1"
            loading="eager"
            sizes="(min-width: 45em) 20vw, 50vw"
            className={classes.image}
          />
        </AspectRatio>
        <Text tt="uppercase" c="dimmed" fw={700} size="xs">
          {artist.fullname}
        </Text>
      </Stack>
      <Radio
        checked={isChecked}
        value={value}
        icon={CheckIcon}
        onChange={() => {}}
        size="lg"
        tabIndex={-1}
        classNames={{
          root: isChecked ? classes.radioChecked : classes.radioUnchecked,
        }}
      />
    </UnstyledButton>
  );
}
